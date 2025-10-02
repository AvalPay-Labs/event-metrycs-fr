import { useEffect, useRef, useCallback } from 'react';
import { useMetricsStore } from '@/store/metrics-store';
import { generateMetricsUpdate, MetricCategory } from '@/lib/mock-metrics';

interface UseRealtimeMetricsOptions {
  eventId: string;
  enabled?: boolean;
  interval?: number; // milliseconds
}

/**
 * Hook to manage real-time metrics updates
 */
export function useRealtimeMetrics({
  eventId,
  enabled = false,
  interval = 30000 // 30 seconds default
}: UseRealtimeMetricsOptions) {
  const {
    currentMetrics,
    realtimeEnabled,
    addRealtimeUpdate,
    applyRealtimeUpdates,
    setIsRefreshing
  } = useMetricsStore();

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastFetchRef = useRef<number>(Date.now());

  /**
   * Fetch real-time updates from API
   */
  const fetchRealtimeUpdates = useCallback(async () => {
    if (!currentMetrics || !realtimeEnabled) {
      return;
    }

    try {
      const response = await fetch(`/api/events/${eventId}/metrics/realtime`);
      const data = await response.json();

      if (data.success && data.updates && data.updates.length > 0) {
        // Add updates to store
        data.updates.forEach((update: { category: MetricCategory; changes: Record<string, number | string>; timestamp: string }) => {
          addRealtimeUpdate(update);
        });

        // Apply updates
        applyRealtimeUpdates();
      }

      lastFetchRef.current = Date.now();
    } catch (error) {
      console.error('Error fetching realtime updates:', error);
    }
  }, [eventId, currentMetrics, realtimeEnabled, addRealtimeUpdate, applyRealtimeUpdates]);

  /**
   * Simulate local updates (for demo purposes)
   * In production, this would be replaced by WebSocket events
   */
  const simulateLocalUpdate = useCallback(() => {
    if (!currentMetrics || !realtimeEnabled) {
      return;
    }

    // Randomly select a category to update
    const categories: MetricCategory[] = ['registration', 'attendance', 'onchain', 'social'];
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];

    // Generate update
    const update = generateMetricsUpdate(currentMetrics, randomCategory);

    // Add to store
    addRealtimeUpdate(update);

    // Apply after a short delay
    setTimeout(() => {
      applyRealtimeUpdates();
    }, 500);
  }, [currentMetrics, realtimeEnabled, addRealtimeUpdate, applyRealtimeUpdates]);

  /**
   * Start real-time updates
   */
  const start = useCallback(() => {
    if (intervalRef.current) {
      return; // Already running
    }

    intervalRef.current = setInterval(() => {
      // Fetch from API
      fetchRealtimeUpdates();

      // Also simulate local updates for demo
      if (Math.random() > 0.5) {
        simulateLocalUpdate();
      }
    }, interval);
  }, [interval, fetchRealtimeUpdates, simulateLocalUpdate]);

  /**
   * Stop real-time updates
   */
  const stop = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  /**
   * Manual refresh
   */
  const refresh = useCallback(async () => {
    setIsRefreshing(true);
    await fetchRealtimeUpdates();
    setIsRefreshing(false);
  }, [fetchRealtimeUpdates, setIsRefreshing]);

  // Effect to start/stop based on enabled prop
  useEffect(() => {
    if (enabled && realtimeEnabled) {
      start();
    } else {
      stop();
    }

    return () => {
      stop();
    };
  }, [enabled, realtimeEnabled, start, stop]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stop();
    };
  }, [stop]);

  return {
    start,
    stop,
    refresh,
    isActive: intervalRef.current !== null,
    lastFetch: lastFetchRef.current
  };
}
