import { useState, useEffect, useRef, useCallback } from 'react';
import type { StockData, MarketItem } from '@/types/api';

interface StockDataHook {
  marketData: StockData | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

// Stock refresh intervals in milliseconds
const MIN_REFRESH_INTERVAL = 30 * 1000; // Minimum 30 seconds between refreshes
const MAX_REFRESH_INTERVAL = 24 * 60 * 60 * 1000; // Maximum 24 hours between refreshes

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

  const fetchStockData = useCallback(async () => {
    const now = Date.now();
    // Rate limiting: Don't fetch if last fetch was less than MIN_REFRESH_INTERVAL ago
    if (!userId || (lastFetchRef.current.main && now - lastFetchRef.current.main < MIN_REFRESH_INTERVAL)) {
      return;
    }
    
    lastFetchRef.current.main = now;

    try {
      setError(null);
      setLoading(true);

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
      
      // Schedule next fetch based on the earliest expiring item across all categories
      const allItems = [
        ...(transformedData.seed_stock || []),
        ...(transformedData.gear_stock || []),
        ...(transformedData.egg_stock || []),
        ...(transformedData.cosmetic_stock || []),
        ...(transformedData.eventshop_stock || []),
        ...(transformedData.travelingmerchant_stock || [])
      ];

      if (allItems.length > 0) {
        // Find the earliest end time, ensuring we don't multiply by 1000 twice
        const earliestEndTime = Math.min(...allItems.map(item => item.end_date_unix * 1000));
        const currentTime = Date.now();
        
        // Calculate delay with bounds
        let delay = Math.max(MIN_REFRESH_INTERVAL, earliestEndTime - currentTime);
        delay = Math.min(delay, MAX_REFRESH_INTERVAL);
        
        // Clear existing timeout
        if (timeoutsRef.current.main) {
          clearTimeout(timeoutsRef.current.main);
        }
        
        // Only schedule next fetch if delay is reasonable
        if (delay >= MIN_REFRESH_INTERVAL && delay <= MAX_REFRESH_INTERVAL) {
          timeoutsRef.current.main = setTimeout(() => {
            console.log('Scheduled stock refresh triggered');
            fetchStockData();
          }, delay);
          
          console.log(`Next stock refresh scheduled in ${Math.round(delay / 1000)}s`);
        }
      } else {
        // If no items, schedule refresh using default interval
        const delay = REFRESH_INTERVALS.seed; // Use shortest default interval
        timeoutsRef.current.main = setTimeout(fetchStockData, delay);
        console.log(`No items found. Next refresh in ${Math.round(delay / 1000)}s`);
      }
      
      setLoading(false);
      
    } catch (err) {
      console.error('Error fetching stock data:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch stock data');
      setLoading(false);
    }
  }, [userId]);

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
