import { useState, useEffect, useRef } from 'react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { sendBrowserNotification } from '@/lib/browserNotifications';

interface StockAlert {
    item_id: string;
    display_name: string;
    message: string;
}

interface WebSocketDataHook {
    travelingMerchantStock: any;
    stockAlert: StockAlert | null;
    wsStatus: 'connecting' | 'connected' | 'disconnected';
}

export const useWebSocketData = (userId: string | null): WebSocketDataHook => {
    const [travelingMerchantStock, setTravelingMerchantStock] = useState<any>(null);
    const [stockAlert, setStockAlert] = useState<StockAlert | null>(null);
    const [wsStatus, setWsStatus] = useState<'connecting' | 'connected' | 'disconnected'>('connecting');
    const wsRef = useRef<WebSocket | null>(null);
    const reconnectingRef = useRef<boolean>(false);
    const intentionalCloseRef = useRef<boolean>(false);
    const JSTUDIO_KEY = import.meta.env.VITE_JSTUDIO_KEY;

    // Effect to show toast when a stock alert is received
useEffect(() => {
    if (!stockAlert) return;

    // In-app toast
    toast({
        title: 'Item in Stock!',
        description: stockAlert.message,
    });

    // Browser/system notification when the tab is hidden
    try {
        if (
            typeof window !== 'undefined' &&
            'Notification' in window &&
            document.hidden &&
            Notification.permission === 'granted'
        ) {
            sendBrowserNotification('Stock Alert', {
                body: stockAlert.message,
                icon: '/favicon.ico',
                url: '/market',
                tag: `stock-${stockAlert.item_id}`,
            });
        }
    } catch (err) {
        console.warn('[WebSocket Alert] Browser notification failed:', err);
    }

    // Reset alert to prevent re-triggering
    setStockAlert(null);
}, [stockAlert]);

    useEffect(() => {
        const fetchStatus = async () => {
            const { data, error } = await supabase
                .from('websocket_status')
                .select('is_connected')
                .eq('id', 'singleton')
                .single();

            if (error) {
                console.error('Error fetching initial websocket status:', error);
                setWsStatus('disconnected');
            } else {
                setWsStatus(data.is_connected ? 'connected' : 'disconnected');
            }
        };

        fetchStatus();

        const channel = supabase
            .channel('websocket_status_changes')
            .on(
                'postgres_changes',
                {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'websocket_status',
                    filter: 'id=eq.singleton',
                },
                (payload) => {
                    const newStatus = payload.new as { is_connected: boolean };
                    setWsStatus(newStatus.is_connected ? 'connected' : 'disconnected');
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    useEffect(() => {
        if (!userId) {
            setTravelingMerchantStock(null);
            return;
        }

        const connectWebSocket = () => {
            try {
                const ws = new WebSocket(`wss://websocket.joshlei.com/growagarden?jstudio-key=${encodeURIComponent(JSTUDIO_KEY)}&userId=${userId}`);
                wsRef.current = ws;

                ws.onopen = () => {
                    console.log('WebSocket connection established');
                };

                ws.onmessage = (event) => {
                    try {
                        const data = JSON.parse(event.data);

                        if (data.travelingmerchant_stock) {
                            console.log('Traveling merchant data received:', data.travelingmerchant_stock);
                            setTravelingMerchantStock(data.travelingmerchant_stock);
                        }

                        if (data.stock_alert) {
                            console.log('Stock alert received:', data.stock_alert);
                            setStockAlert(data.stock_alert);
                        }
                    } catch (error) {
                        console.error('Error parsing WebSocket message:', error);
                    }
                };

                ws.onerror = (error) => {
                    console.error('WebSocket error:', error);
                };

                ws.onclose = (event) => {
                    console.log('WebSocket connection closed', event.code, event.reason);

                    if (event.code !== 1000 && event.code !== 4001 && !intentionalCloseRef.current && !reconnectingRef.current) {
                        reconnectingRef.current = true;
                        setTimeout(() => {
                            reconnectingRef.current = false;
                            if (wsRef.current?.readyState === WebSocket.CLOSED) {
                                console.log('Attempting to reconnect WebSocket...');
                                connectWebSocket();
                            }
                        }, 5000);
                    }
                };

            } catch (error) {
                console.error('Failed to create WebSocket connection:', error);
            }
        };

        connectWebSocket();

        return () => {
            if (wsRef.current) {
                console.log('Closing WebSocket connection');
                intentionalCloseRef.current = true;
                wsRef.current.close();
                wsRef.current = null;
            }
        };
    }, [userId, JSTUDIO_KEY]);

    return {
        travelingMerchantStock,
        stockAlert,
        wsStatus,
    };
};