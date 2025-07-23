import { useState, useCallback } from 'react';
import type { StockData } from '@/types/api';
import { useSmartFetch, UPDATE_INTERVALS } from './useSmartFetch';

interface StockDataHook {
    marketData: StockData | null;
    loading: boolean;
    error: string | null;
    refetch: () => void;
}

export const useStockData = (userId: string | null): StockDataHook => {
    const [marketData, setMarketData] = useState<StockData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchStockData = useCallback(async () => {
        if (!userId) return;

        try {
            setLoading(true);
            setError(null);

            const response = await fetch('https://api.joshlei.com/v2/growagarden/stock', {
                headers: {
                    'Jstudio-key': 'jstudio',
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch stock data: ${response.statusText}`);
            }

            const data = await response.json();
            
            // Transform the data to match expected structure
            const transformedData: StockData = {
                seed_stock: Array.isArray(data.seed_stock) ? data.seed_stock : [],
                gear_stock: Array.isArray(data.gear_stock) ? data.gear_stock : [],
                egg_stock: Array.isArray(data.egg_stock) ? data.egg_stock : [],
                cosmetic_stock: Array.isArray(data.cosmetic_stock) ? data.cosmetic_stock : [],
                eventshop_stock: Array.isArray(data.eventshop_stock) ? data.eventshop_stock : [],
                travelingmerchant_stock: (data.travelingmerchant_stock && Array.isArray(data.travelingmerchant_stock.stock)) ? data.travelingmerchant_stock.stock : [],
                notifications: Array.isArray(data.notifications) ? data.notifications : [],
                discord_invite: typeof data.discord_invite === 'string' ? data.discord_invite : ''
            };

            setMarketData(transformedData);
            setLoading(false);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch stock data');
            setLoading(false);
        }
    }, [userId]);

    // Set up smart fetching for different data types
    useSmartFetch(fetchStockData, UPDATE_INTERVALS.SEED_GEAR);     // Seeds and Gear (5 min)
    useSmartFetch(fetchStockData, UPDATE_INTERVALS.EGG);          // Eggs (30 min)
    useSmartFetch(fetchStockData, UPDATE_INTERVALS.EVENT);        // Events (1 hour)
    useSmartFetch(fetchStockData, UPDATE_INTERVALS.COSMETIC_MERCHANT); // Cosmetics/Merchant (4 hours)

    return {
        marketData,
        loading,
        error,
        refetch: fetchStockData
    };
};
