import { useState, useCallback, useRef, useEffect } from 'react';
import type { StockData } from '@/types/api';
import { useSmartFetch, UPDATE_INTERVALS } from './useSmartFetch';
import isEqual from 'lodash/isEqual';

interface StockDataHook {
    marketData: StockData | null;
    loading: boolean;
    refreshing: boolean;  // Separate state for background refreshes
    error: string | null;
    refetch: () => void;
}

export const useStockData = (userId: string | null): StockDataHook => {
    const [marketData, setMarketData] = useState<StockData | null>(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const isInitialFetchRef = useRef(true);

    // Keep track of last update times for each data type
    const lastUpdateRef = useRef<Record<keyof typeof UPDATE_INTERVALS, number>>({
        SEED_GEAR: 0,
        EGG: 0,
        EVENT: 0,
        COSMETIC_MERCHANT: 0
    });

    const debug = process.env.NODE_ENV === 'development';
    
    const fetchStockData = useCallback(async () => {
        if (!userId) {
            if (debug) console.log('[Stock Data] No userId, skipping fetch');
            return;
        }

        // Determine loading state based on whether this is initial load
        const isInitialFetch = isInitialFetchRef.current;
        if (debug) console.log(`[Stock Data] Starting fetch (${isInitialFetch ? 'initial' : 'update'})`);

        if (isInitialFetch) {
            setLoading(true);
        } else {
            setRefreshing(true);
        }
        
        try {
            setError(null);

            if (debug) console.log('[Stock Data] Fetching from API...');
            const response = await fetch('https://api.joshlei.com/v2/growagarden/stock', {
                headers: {
                    'Jstudio-key': 'jstudio',
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch stock data: ${response.statusText}`);
            }

            const responseClone = response.clone();
            const data = await response.json();
            
            if (debug) {
                console.log('[Stock Data] Raw API Response:', await responseClone.json());
            }
            
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

            if (debug) {
                console.log('[Stock Data] Transformed data:', transformedData);
            }

            // Only update data that's due for an update based on its interval
            const now = Date.now();
            let shouldUpdate = false;

            // Check each data type's update interval
            const intervals = ['SEED_GEAR', 'EGG', 'EVENT', 'COSMETIC_MERCHANT'] as const;
            
            for (const type of intervals) {
                const lastUpdate = lastUpdateRef.current[type];
                const interval = UPDATE_INTERVALS[type].interval;
                const timeSinceUpdate = now - (lastUpdate || 0);

                if (debug) {
                    console.log(`[Stock Data] [${type}] Last update: ${lastUpdate || 'never'}, Time since: ${Math.round(timeSinceUpdate / 1000)}s, Interval: ${Math.round(interval / 1000)}s`);
                }

                if (!lastUpdate || timeSinceUpdate >= interval) {
                    if (debug) console.log(`[Stock Data] [${type}] Due for update`);
                    shouldUpdate = true;
                    lastUpdateRef.current[type] = now;
                }
            }

            // Check if the data has actually changed using deep comparison
            const hasDataChanged = !isEqual(marketData, transformedData);
            
            // Update if it's initial fetch, data should update based on interval, or data has changed
            if (isInitialFetch || shouldUpdate || hasDataChanged) {
                if (debug) {
                    console.log('[Stock Data] State update triggered:', {
                        reason: isInitialFetch ? 'initial fetch' : 
                               shouldUpdate ? 'interval update needed' : 
                               'data changed',
                        hasDataChanged,
                        marketDataExists: !!marketData,
                        transformedDataExists: !!transformedData,
                        stockCounts: {
                            current: marketData ? {
                                seeds: marketData.seed_stock.length,
                                gear: marketData.gear_stock.length,
                                eggs: marketData.egg_stock.length,
                                cosmetic: marketData.cosmetic_stock.length,
                                event: marketData.eventshop_stock.length,
                                merchant: marketData.travelingmerchant_stock.length
                            } : 'no current data',
                            new: {
                                seeds: transformedData.seed_stock.length,
                                gear: transformedData.gear_stock.length,
                                eggs: transformedData.egg_stock.length,
                                cosmetic: transformedData.cosmetic_stock.length,
                                event: transformedData.eventshop_stock.length,
                                merchant: transformedData.travelingmerchant_stock.length
                            }
                        }
                    });
                }

                // Force a new object reference to ensure React detects the change
                setMarketData(prevData => {
                    if (isEqual(prevData, transformedData)) {
                        return hasDataChanged ? { ...transformedData } : prevData;
                    }
                    return transformedData;
                });

                if (isInitialFetchRef.current) {
                    isInitialFetchRef.current = false;
                }
            } else if (debug) {
                console.log('[Stock Data] Skipping state update - no changes needed', {
                    hasDataChanged,
                    shouldUpdate,
                    isInitialFetch
                });
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch stock data');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [userId]);

    // Effect to trigger fetch when userId becomes available
    useEffect(() => {
        if (!userId) return;

        if (debug) {
            console.log("[Stock Data] userId now available:", userId);
            console.log("[Stock Data] Triggering initial fetch");
        }

        // Reset the initial fetch flag to ensure data is loaded
        isInitialFetchRef.current = true;
        fetchStockData();
    }, [userId, fetchStockData]);

    // Set up a single smart fetch with the shortest interval
    useSmartFetch(fetchStockData, UPDATE_INTERVALS.SEED_GEAR, {
        initialFetch: false, // Don't fetch immediately, let the useEffect handle it
        debug: process.env.NODE_ENV === 'development',
        delayMs: 3000
    });

    // Debug effect to track state changes
    useEffect(() => {
        if (debug && marketData) {
            console.log('🔄 [Stock Data] State updated in hook:', {
                dataPresent: !!marketData,
                counts: {
                    seeds: marketData.seed_stock.length,
                    gear: marketData.gear_stock.length,
                    eggs: marketData.egg_stock.length,
                    cosmetic: marketData.cosmetic_stock.length,
                    event: marketData.eventshop_stock.length,
                    merchant: marketData.travelingmerchant_stock.length
                },
                loading,
                refreshing
            });
        }
    }, [marketData, loading, refreshing, debug]);

    return {
        marketData,
        loading,
        refreshing,
        error,
        refetch: fetchStockData
    };
};
