import { useState, useCallback, useRef, useEffect } from 'react';
import type { StockData } from '@/types/api';
import { useSmartFetch, UPDATE_INTERVALS } from './useSmartFetch';
import isEqual from 'lodash/isEqual';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { sendBrowserNotification } from '@/lib/browserNotifications';

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
    const prevMarketDataRef = useRef<StockData | null>(null);
    const [alertItemIds, setAlertItemIds] = useState<Set<string>>(new Set());
    const [isAlertsLoaded, setIsAlertsLoaded] = useState(false);

    // Keep track of last update times for each data type
    const lastUpdateRef = useRef<Record<keyof typeof UPDATE_INTERVALS, number>>({
        SEED_GEAR: 0,
        EGG: 0,
        EVENT: 0,
        COSMETIC_MERCHANT: 0
    });

    const debug = (typeof window !== 'undefined' && localStorage.getItem('debug') === '1') || import.meta.env.DEV;

    // Fetch user's stock alert preferences
    useEffect(() => {
        const fetchUserAlerts = async () => {
            if (!userId) return;
            try {
                const { data, error } = await supabase
                    .from('user_stock_alerts')
                    .select('item_id')
                    .eq('user_id', userId);
                
                // Expand alert IDs with common variations (e.g., seed vs base id)
                const baseIds = (data || []).map((item) => item.item_id);
                const expanded = new Set<string>();
                for (const id of baseIds) {
                    expanded.add(id);
                    if (id.endsWith('_seed')) {
                        expanded.add(id.replace(/_seed$/, ''));
                    } else {
                        expanded.add(`${id}_seed`);
                    }
                }
                if (debug) {
                    console.log('[Stock Alert] Loaded user alert IDs:', {
                        baseIds,
                        expanded: Array.from(expanded)
                    });
                }
                setAlertItemIds(expanded);
            } catch (err) {
                console.error("Failed to fetch user stock alerts:", err);
            } finally {
                setIsAlertsLoaded(true);
            }
        };

        fetchUserAlerts();
    }, [userId]);
    
    const fetchStockData = useCallback(async () => {
        if (!userId || !isAlertsLoaded) {
            if (debug) console.log('[Stock Data] No userId or alerts not loaded, skipping fetch');
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
            const headers: Record<string, string> = { 'Content-Type': 'application/json' };
            const jstudioKey = (import.meta as any).env?.VITE_JSTUDIO_KEY;
            if (jstudioKey) {
                headers['Jstudio-key'] = jstudioKey;
            } else if (debug) {
                console.warn('[Stock Data] Missing Jstudio-key env; proceeding without it');
            }
            const response = await fetch('https://api.joshlei.com/v2/growagarden/stock', {
                headers
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
            let transformedData: StockData = {
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
            
            // --- Stock Alert Notification Logic ---
            if (debug) {
                console.log('[Stock Alert] Checking stock alerts:', {
                    hasPrevData: !!prevMarketDataRef.current,
                    alertItemsCount: alertItemIds.size,
                    alertItems: Array.from(alertItemIds),
                    userId: userId
                });
            }

            if (prevMarketDataRef.current && alertItemIds.size > 0 && userId) {
                const allOldItems = [
                    ...prevMarketDataRef.current.seed_stock,
                    ...prevMarketDataRef.current.gear_stock,
                    ...prevMarketDataRef.current.egg_stock,
                ];
                const oldStockMap = new Map(allOldItems.map(item => [item.item_id, item.quantity]));

                const allNewItems = [
                    ...transformedData.seed_stock,
                    ...transformedData.gear_stock,
                    ...transformedData.egg_stock,
                ];

                if (debug) {
                    console.log('[Stock Alert] Comparing stock levels:', {
                        oldItems: allOldItems.length,
                        newItems: allNewItems.length
                    });
                }

                for (const newItem of allNewItems) {
                    if (alertItemIds.has(newItem.item_id)) {
                        const oldStock = oldStockMap.get(newItem.item_id) || 0;
                        
                        const willTrigger = newItem.quantity > oldStock;
                        if (debug) {
                            console.log(`[Stock Alert] Checking ${newItem.display_name}:`, {
                                itemId: newItem.item_id,
                                oldStock,
                                newStock: newItem.quantity,
                                willTrigger
                            });
                        }

                        if (willTrigger) {
                            const isRestock = oldStock === 0;
                            const message = isRestock
                                ? `🎉 ${newItem.display_name} is back in stock!`
                                : `📈 ${newItem.display_name} stock has increased!`;

                            console.log(`🔔 [Stock Alert] Triggering for ${newItem.display_name}!`);
                            
                            // Show a toast for immediate feedback
                            toast.success(message, {
                                description: `Now at quantity: ${newItem.quantity}`,
                                action: {
                                    label: "View Market",
                                    onClick: () => window.location.href = "/market"
                                }
                            });

                            // Browser notification (only when tab is hidden to avoid duplicates)
                            try {
                                const canNotify =
                                    typeof window !== 'undefined' &&
                                    'Notification' in window &&
                                    document.hidden &&
                                    Notification.permission === 'granted';

                                if (canNotify) {
                                    sendBrowserNotification('Stock Alert', {
                                        body: `${newItem.display_name} ${isRestock ? 'is back in stock' : 'stock increased'} — Qty: ${newItem.quantity}`,
                                        icon: '/favicon.ico',
                                        url: '/market',
                                        tag: `stock-${newItem.item_id}`,
                                    });
                                } else if (debug) {
                                    console.log('[Stock Alert] Skipping browser notification', {
                                        hidden: typeof document !== 'undefined' ? document.hidden : undefined,
                                        permission: (typeof window !== 'undefined' && 'Notification' in window) ? Notification.permission : 'unavailable',
                                    });
                                }
                            } catch (e) {
                                console.warn('[Stock Alert] Browser notification failed:', e);
                            }

                            // Create a persistent notification
                            const insertNotification = async () => {
                                try {
                                    const { error: insertError } = await supabase
                                        .from('notifications')
                                        .insert({
                                            user_id: userId,
                                            message: `${newItem.display_name} is back in stock! (Quantity: ${newItem.quantity})`,
                                            item_id: newItem.item_id,
                                            icon: 'stock_alert',
                                        });

                                    if (insertError) {
                                        console.error('[Stock Alert] Failed to insert notification:', insertError);
                                        toast.error('Failed to save stock alert notification.');
                                    } else {
                                        console.log(`✅ [Stock Alert] Notification saved for ${newItem.display_name}`);
                                    }
                                } catch (err) {
                                    console.error('[Stock Alert] Error creating notification:', err);
                                }
                            };

                            insertNotification();
                        }
                    }
                }
            }

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

                prevMarketDataRef.current = transformedData;


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
    }, [userId, isAlertsLoaded]);

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
        debug: import.meta.env.DEV,
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