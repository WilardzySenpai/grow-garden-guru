import { useState, useEffect, useRef } from 'react';
import { toast } from '@/hooks/use-toast';

interface WebSocketDataHook {
    weatherData: any;
    notifications: any[];
    travelingMerchantStock: any;
    wsStatus: 'connecting' | 'connected' | 'disconnected';
}

export const useWebSocketData = (userId: string | null): WebSocketDataHook => {
    const [weatherData, setWeatherData] = useState<any>(null);
    const [notifications, setNotifications] = useState<any[]>([]);
    const [travelingMerchantStock, setTravelingMerchantStock] = useState<any>(null);
    const [wsStatus, setWsStatus] = useState<'connecting' | 'connected' | 'disconnected'>('disconnected');
    const wsRef = useRef<WebSocket | null>(null);
    const reconnectingRef = useRef<boolean>(false);
    const intentionalCloseRef = useRef<boolean>(false);
    const JSTUDIO_KEY = import.meta.env.VITE_JSTUDIO_KEY;

    useEffect(() => {
        if (!userId) {
            setWsStatus('disconnected');
            setWeatherData(null);
            setNotifications([]);
            setTravelingMerchantStock(null);
            return;
        }

        const connectWebSocket = () => {
            try {
                setWsStatus('connecting');
                const ws = new WebSocket(`wss://websocket.joshlei.com/growagarden?jstudio-key=${encodeURIComponent(JSTUDIO_KEY)}`);
                wsRef.current = ws;

                ws.onopen = () => {
                    console.log('WebSocket connection established');
                    setWsStatus('connected');
                    toast({
                        title: "Live Data Connected",
                        description: "Real-time updates enabled!",
                    });
                };

                ws.onmessage = (event) => {
                    try {
                        const data = JSON.parse(event.data);

                        if (data.weather) {
                            console.log('Weather data received:', data.weather);
                            setWeatherData(data.weather);
                        }

                        if (data.notification) {
                            console.log('Notification data received:', data.notification);
                            setNotifications(prev => [...data.notification, ...prev]);
                        }

                        if (data.travelingmerchant_stock) {
                            console.log('Traveling merchant data received:', data.travelingmerchant_stock);
                            setTravelingMerchantStock(data.travelingmerchant_stock);
                        }
                    } catch (error) {
                        console.error('Error parsing WebSocket message:', error);
                    }
                };

                ws.onerror = (error) => {
                    console.error('WebSocket error:', error);
                    setWsStatus('disconnected');
                };

                ws.onclose = (event) => {
                    console.log('WebSocket connection closed', event.code, event.reason);
                    setWsStatus('disconnected');

                    // Don't reconnect if:
                    // 1. Code 1000 (normal closure)
                    // 2. Code 4001 (another connection established)
                    // 3. Intentional close (component unmounting)
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
                setWsStatus('disconnected');
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
    }, [userId]);

    return {
        weatherData,
        notifications,
        travelingMerchantStock,
        wsStatus,
    };
};