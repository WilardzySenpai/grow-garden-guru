import { useState, useEffect, useRef, useCallback } from 'react';
import type { StockData, MarketItem } from '@/types/api';

interface StockDataHook {
  marketData: StockData | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

// Stock refresh intervals in milliseconds
const REFRESH_INTERVALS = {
  seed: 5 * 60 * 1000,    // 5 minutes
  gear: 5 * 60 * 1000,    // 5 minutes
  eventshop: 30 * 60 * 1000,  // 30 minutes
  seedshop: 30 * 60 * 1000,   // 30 minutes (assuming this is separate from seed)
  cosmetic: 4 * 60 * 60 * 1000,  // 4 hours
  travelingmerchant: 4 * 60 * 60 * 1000,  // 4 hours
};

export const useStockData = (userId: string | null): StockDataHook => {
  const [marketData, setMarketData] = useState<StockData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const timeoutsRef = useRef<Record<string, NodeJS.Timeout | undefined>>({});
  const lastFetchRef = useRef<Record<string, number>>({});

  const calculateNextFetch = useCallback((items: MarketItem[], stockType: string): number => {
    if (!items || items.length === 0) {
      // If no items, use the default interval
      return Date.now() + REFRESH_INTERVALS[stockType as keyof typeof REFRESH_INTERVALS];
    }

    // Find the earliest end_date_unix among all items
    const earliestEndTime = Math.min(...items.map(item => item.end_date_unix * 1000));
    const now = Date.now();
    
    // If all items have already expired, fetch immediately
    if (earliestEndTime <= now) {
      return now;
    }
    
    // Otherwise, schedule fetch for when the first item expires
    return earliestEndTime;
  }, []);

  const fetchStockData = useCallback(async (stockType?: string) => {
    if (!userId) return;

    try {
      setError(null);
      
      // For initial load, fetch all stock types
      if (!stockType) {
        setLoading(true);
      }

      const baseUrl = 'https://websocket.joshlei.com/growagarden/api';
      const endpoints = {
        seed: `${baseUrl}/seed_stock?user_id=${encodeURIComponent(userId)}`,
        gear: `${baseUrl}/gear_stock?user_id=${encodeURIComponent(userId)}`,
        egg: `${baseUrl}/egg_stock?user_id=${encodeURIComponent(userId)}`,
        cosmetic: `${baseUrl}/cosmetic_stock?user_id=${encodeURIComponent(userId)}`,
        eventshop: `${baseUrl}/eventshop_stock?user_id=${encodeURIComponent(userId)}`,
        travelingmerchant: `${baseUrl}/travelingmerchant_stock?user_id=${encodeURIComponent(userId)}`,
      };

      const stockTypesToFetch = stockType ? [stockType] : Object.keys(endpoints);
      const fetchPromises = stockTypesToFetch.map(async (type) => {
        const response = await fetch(endpoints[type as keyof typeof endpoints]);
        if (!response.ok) {
          throw new Error(`Failed to fetch ${type} stock: ${response.statusText}`);
        }
        const data = await response.json();
        return { type, data };
      });

      const results = await Promise.allSettled(fetchPromises);
      const newMarketData: Partial<StockData> = marketData ? { ...marketData } : {};

      results.forEach((result, index) => {
        const type = stockTypesToFetch[index];
        if (result.status === 'fulfilled') {
          const stockKey = `${type}_stock` as keyof StockData;
          (newMarketData as any)[stockKey] = result.value.data;
          
          // Schedule next fetch for this stock type
          const nextFetchTime = calculateNextFetch(result.value.data, type);
          const delay = Math.max(0, nextFetchTime - Date.now());
          
          // Clear existing timeout for this stock type
          if (timeoutsRef.current[type]) {
            clearTimeout(timeoutsRef.current[type]);
          }
          
          // Schedule next fetch
          timeoutsRef.current[type] = setTimeout(() => {
            console.log(`Scheduled fetch triggered for ${type} stock`);
            fetchStockData(type);
          }, delay);
          
          lastFetchRef.current[type] = Date.now();
          
          console.log(`${type} stock: scheduled next fetch in ${Math.round(delay / 1000)}s`);
        } else {
          console.error(`Failed to fetch ${type} stock:`, result.reason);
        }
      });

      setMarketData(newMarketData as StockData);
      setLoading(false);
      
    } catch (err) {
      console.error('Error fetching stock data:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch stock data');
      setLoading(false);
    }
  }, [userId, marketData, calculateNextFetch]);

  const refetch = useCallback(() => {
    fetchStockData();
  }, [fetchStockData]);

  // Initial fetch and setup
  useEffect(() => {
    if (userId) {
      fetchStockData();
    } else {
      setLoading(false);
      setMarketData(null);
    }

    // Cleanup timeouts on unmount or user change
    return () => {
      Object.values(timeoutsRef.current).forEach(timeout => {
        if (timeout) clearTimeout(timeout);
      });
      timeoutsRef.current = {};
    };
  }, [userId, fetchStockData]);

  return {
    marketData,
    loading,
    error,
    refetch,
  };
};
