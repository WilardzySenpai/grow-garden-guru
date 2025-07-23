import { useEffect, useRef } from 'react';

export type UpdateInterval = {
  interval: number;  // in milliseconds
  name: string;      // for debugging/logging
};

// Standardize time to align fetches across tabs/clients
const getAlignedTimestamp = (interval: number) => Math.floor(Date.now() / interval) * interval;

export const UPDATE_INTERVALS = {
  SEED_GEAR: { interval: 5 * 60 * 1000, name: 'Seed & Gear' },         // 5 minutes
  EGG: { interval: 30 * 60 * 1000, name: 'Egg' },                      // 30 minutes
  EVENT: { interval: 60 * 60 * 1000, name: 'Event' },                  // 1 hour
  COSMETIC_MERCHANT: { interval: 4 * 60 * 60 * 1000, name: 'Cosmetic/Merchant' }, // 4 hours
} as const;

export interface SmartFetchOptions {
  initialFetch?: boolean;     // Whether to fetch immediately on mount
  debug?: boolean;            // Enable debug logging
  delayMs?: number;          // Buffer time after scheduled update
}

const DEFAULT_OPTIONS: SmartFetchOptions = {
  initialFetch: true,
  debug: process.env.NODE_ENV === 'development',
  delayMs: 3000
};

/**
 * Custom hook for smart API fetching that aligns with server-side update schedules
 * @param fetchFn The function to call for fetching data
 * @param interval The interval configuration (from UPDATE_INTERVALS)
 * @param options Configuration options for the smart fetch behavior
 */
export function useSmartFetch(
  fetchFn: () => Promise<void> | void,
  interval: UpdateInterval,
  options: SmartFetchOptions = DEFAULT_OPTIONS
) {
  const { initialFetch, debug, delayMs } = { ...DEFAULT_OPTIONS, ...options };
  
  // Keep track of our timeouts/intervals and state
  const timeoutRef = useRef<NodeJS.Timeout>();
  const intervalRef = useRef<NodeJS.Timeout>();
  const lastFetchTimeRef = useRef<number>(0);
  const isInitialFetchRef = useRef(true);

  useEffect(() => {
    // Helper for debug logging
    const logDebug = (message: string) => {
      if (debug) {
        console.log(`[${interval.name}] ${message}`);
      }
    };

    // Wrapper to prevent duplicate fetches within the same interval
    const safeFetch = async () => {
      const now = Date.now();
      const timeSinceLastFetch = now - lastFetchTimeRef.current;
      
      logDebug(`Checking fetch timing - Time since last: ${Math.round(timeSinceLastFetch / 1000)}s, Threshold: ${Math.round(interval.interval * 0.8 / 1000)}s`);
      
      // Allow fetch if it's initial or enough time has passed
      if (isInitialFetchRef.current || timeSinceLastFetch >= interval.interval * 0.8) {
        logDebug(`Executing fetch - ${isInitialFetchRef.current ? 'Initial fetch' : 'Regular update'}`);
        lastFetchTimeRef.current = now;
        await fetchFn();
        isInitialFetchRef.current = false;
      } else {
        logDebug(`Skipping fetch - last fetch was ${Math.round(timeSinceLastFetch / 1000)}s ago`);
        return;
      }
    };

    // Initial fetch if enabled
    if (initialFetch) {
      logDebug('Initial fetch');
      safeFetch();
    }

    // Calculate time until next aligned update using standardized time
    const alignedTime = getAlignedTimestamp(interval.interval);
    const now = Date.now();
    const timeUntilNextAligned = (alignedTime + interval.interval - now) + (delayMs || 0);

    logDebug(`Next fetch in ${Math.round(timeUntilNextAligned / 1000)}s`);

    // Set timeout to wait for the next aligned update
    timeoutRef.current = setTimeout(() => {
      safeFetch();

      // Continue fetching at the correct interval from this point
      intervalRef.current = setInterval(safeFetch, interval.interval);
      logDebug(`Started interval timer (${interval.interval / 1000}s)`);
    }, timeUntilNextAligned);

    // Cleanup on unmount
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (intervalRef.current) clearInterval(intervalRef.current);
      logDebug('Cleaned up timers');
    };
  }, [fetchFn, interval, initialFetch, debug, delayMs]);
}
