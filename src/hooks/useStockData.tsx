import { useState, useEffect, useRef } from 'react';
import type { StockData, MarketItem } from '@/types/api';
import { toast } from 'sonner';
import { sendBrowserNotification } from '@/lib/browserNotifications';
import StockWorker from '@/workers/stock.worker.ts?worker';

interface StockDataHook {
    marketData: StockData | null;
    loading: boolean;
    refreshing: boolean;
    error: string | null;
    refetch: () => void;
}

export const useStockData = (userId: string | null): StockDataHook => {
    const [marketData, setMarketData] = useState<StockData | null>(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const workerRef = useRef<Worker | null>(null);

    const debug = (typeof window !== 'undefined' && localStorage.getItem('debug') === '1') || import.meta.env.DEV;

    useEffect(() => {
        if (!userId) {
            return;
        }

        const worker = new StockWorker();
        workerRef.current = worker;

        const jstudioKey = (import.meta as any).env?.VITE_JSTUDIO_KEY;

        worker.postMessage({
            type: 'start',
            userId,
            jstudioKey,
        });

        worker.onmessage = (event) => {
            const { type, data, item, isRestock, message } = event.data;

            if (type === 'market_data') {
                setMarketData(data);
                if (loading) setLoading(false);
                if (refreshing) setRefreshing(false);
            } else if (type === 'stock_alert') {
                const stockItem = item as MarketItem;
                const message = isRestock
                    ? `🎉 ${stockItem.display_name} is back in stock!`
                    : `📈 ${stockItem.display_name} stock has increased!`;

                toast.success(message, {
                    description: `Now at quantity: ${stockItem.quantity}`,
                    action: {
                        label: "View Market",
                        onClick: () => window.location.href = "/market"
                    }
                });

                if (document.hidden) {
                    sendBrowserNotification('Stock Alert', {
                        body: `${stockItem.display_name} ${isRestock ? 'is back in stock' : 'stock increased'} — Qty: ${stockItem.quantity}`,
                        icon: '/favicon.ico',
                        url: '/market',
                        tag: `stock-${stockItem.item_id}`
                    });
                }
            } else if (type === 'error') {
                setError(message);
                if (loading) setLoading(false);
                if (refreshing) setRefreshing(false);
            }
        };

        return () => {
            worker.postMessage({ type: 'stop' });
            worker.terminate();
        };
    }, [userId]);

    const refetch = () => {
        if (workerRef.current) {
            setRefreshing(true);
            workerRef.current.postMessage({ type: 'fetch' }); // Assuming worker handles a 'fetch' message
        }
    };

    return {
        marketData,
        loading,
        refreshing,
        error,
        refetch,
    };
};
