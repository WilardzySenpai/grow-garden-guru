import { useEffect, useRef } from 'react';

export type UpdateInterval = {
  interval: number;  // in milliseconds
  name: string;      // for debugging/logging
};

export const UPDATE_INTERVALS = {
  SEED_GEAR: { interval: 5 * 60 * 1000, name: 'Seed & Gear' },         // 5 minutes
  EGG: { interval: 30 * 60 * 1000, name: 'Egg' },                      // 30 minutes
  EVENT: { interval: 60 * 60 * 1000, name: 'Event' },                  // 1 hour
  COSMETIC_MERCHANT: { interval: 4 * 60 * 60 * 1000, name: 'Cosmetic/Merchant' }, // 4 hours
} as const;

/**
 * Custom hook for smart API fetching that aligns with server-side update schedules
 * @param fetchFn The function to call for fetching data
 * @param interval The interval configuration (from UPDATE_INTERVALS)
 * @param delayMs Buffer time to wait after the scheduled update (default: 3000ms)
 */
export function useSmartFetch(
  fetchFn: () => Promise<void> | void,
  interval: UpdateInterval,
  delayMs: number = 3000
) {
  // Keep track of our timeouts/intervals for cleanup
  const timeoutRef = useRef<NodeJS.Timeout>();
  const intervalRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    // Fetch immediately on mount
    fetchFn();

    // Calculate time until next real-world update + buffer
    const now = Date.now();
    const timeSinceLastInterval = now % interval.interval;
    const timeUntilNextAligned = interval.interval - timeSinceLastInterval + delayMs;

    // Set timeout to wait for the next aligned update
    timeoutRef.current = setTimeout(() => {
      fetchFn();

      // Continue fetching at the correct interval from this point
      intervalRef.current = setInterval(fetchFn, interval.interval);
    }, timeUntilNextAligned);

    // Cleanup on unmount
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [fetchFn, interval.interval, delayMs]);
}
