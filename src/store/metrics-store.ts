import { create } from 'zustand';
import {
  EventMetrics,
  MetricsUpdate,
  MetricCategory
} from '@/lib/mock-metrics';

export type MetricsTimeRange = '24h' | '7d' | '30d' | 'all';
export type MetricsView = 'overview' | 'registration' | 'attendance' | 'onchain' | 'social' | 'comparison';

interface MetricsStoreState {
  // Current metrics data
  currentMetrics: EventMetrics | null;
  metricsHistory: Record<string, EventMetrics>; // eventId -> metrics

  // Real-time updates
  realtimeEnabled: boolean;
  realtimeInterval: number | null;
  pendingUpdates: MetricsUpdate[];

  // Filters and views
  selectedView: MetricsView;
  timeRange: MetricsTimeRange;
  selectedCategories: MetricCategory[];

  // UI state
  isLoading: boolean;
  isRefreshing: boolean;
  error: string | null;
  lastUpdateTime: string | null;

  // Export state
  isExporting: boolean;
  exportFormat: 'csv' | 'pdf' | null;

  // Actions - Data management
  setCurrentMetrics: (metrics: EventMetrics) => void;
  updateMetrics: (eventId: string, metrics: EventMetrics) => void;
  getMetricsByEventId: (eventId: string) => EventMetrics | null;
  clearMetrics: () => void;

  // Actions - Real-time updates
  enableRealtime: () => void;
  disableRealtime: () => void;
  addRealtimeUpdate: (update: MetricsUpdate) => void;
  applyRealtimeUpdates: () => void;
  clearRealtimeUpdates: () => void;

  // Actions - View and filter management
  setSelectedView: (view: MetricsView) => void;
  setTimeRange: (range: MetricsTimeRange) => void;
  toggleCategory: (category: MetricCategory) => void;
  selectAllCategories: () => void;

  // Actions - UI state
  setIsLoading: (loading: boolean) => void;
  setIsRefreshing: (refreshing: boolean) => void;
  setError: (error: string | null) => void;

  // Actions - Export
  startExport: (format: 'csv' | 'pdf') => void;
  finishExport: () => void;

  // Computed actions
  getFilteredMetrics: () => Partial<EventMetrics> | null;
  getMetricsSummary: () => MetricsSummary | null;
  hasMetrics: () => boolean;

  // Reset
  reset: () => void;
}

export interface MetricsSummary {
  totalRegistrations: number;
  totalAttendance: number;
  conversionRate: number;
  totalTransactions: number;
  totalWallets: number;
  socialEngagement: number;
  lastUpdated: string;
}

const ALL_CATEGORIES: MetricCategory[] = ['registration', 'attendance', 'onchain', 'social'];

export const useMetricsStore = create<MetricsStoreState>((set, get) => ({
  // Initial state
  currentMetrics: null,
  metricsHistory: {},
  realtimeEnabled: false,
  realtimeInterval: null,
  pendingUpdates: [],
  selectedView: 'overview',
  timeRange: 'all',
  selectedCategories: [...ALL_CATEGORIES],
  isLoading: false,
  isRefreshing: false,
  error: null,
  lastUpdateTime: null,
  isExporting: false,
  exportFormat: null,

  // Data management
  setCurrentMetrics: (metrics) => {
    set({
      currentMetrics: metrics,
      lastUpdateTime: new Date().toISOString(),
      error: null
    });
    // Also store in history
    if (metrics) {
      set((state) => ({
        metricsHistory: {
          ...state.metricsHistory,
          [metrics.eventId]: metrics
        }
      }));
    }
  },

  updateMetrics: (eventId, metrics) => {
    set((state) => ({
      metricsHistory: {
        ...state.metricsHistory,
        [eventId]: metrics
      },
      currentMetrics: state.currentMetrics?.eventId === eventId ? metrics : state.currentMetrics,
      lastUpdateTime: new Date().toISOString()
    }));
  },

  getMetricsByEventId: (eventId) => {
    const { metricsHistory } = get();
    return metricsHistory[eventId] || null;
  },

  clearMetrics: () => {
    set({
      currentMetrics: null,
      metricsHistory: {},
      pendingUpdates: [],
      lastUpdateTime: null,
      error: null
    });
  },

  // Real-time updates
  enableRealtime: () => {
    const interval = window.setInterval(() => {
      // Trigger update check
      const { currentMetrics } = get();
      if (currentMetrics) {
        // Placeholder for real-time update logic
        // In real implementation, this would poll the API or listen to WebSocket
      }
    }, 30000); // Check every 30 seconds

    set({ realtimeEnabled: true, realtimeInterval: interval });
  },

  disableRealtime: () => {
    const { realtimeInterval } = get();
    if (realtimeInterval) {
      clearInterval(realtimeInterval);
    }
    set({ realtimeEnabled: false, realtimeInterval: null });
  },

  addRealtimeUpdate: (update) => {
    set((state) => ({
      pendingUpdates: [...state.pendingUpdates, update]
    }));
  },

  applyRealtimeUpdates: () => {
    const { currentMetrics, pendingUpdates } = get();

    if (!currentMetrics || pendingUpdates.length === 0) {
      return;
    }

    // Apply all pending updates to current metrics
    const updatedMetrics = pendingUpdates.reduce((metrics, update) => {
      const { category, changes } = update;

      switch (category) {
        case 'registration':
          if (changes.total !== undefined) {
            return {
              ...metrics,
              registration: {
                ...metrics.registration,
                total: changes.total as number
              }
            };
          }
          break;
        case 'attendance':
          if (changes.checkedIn !== undefined) {
            return {
              ...metrics,
              attendance: {
                ...metrics.attendance,
                checkedIn: changes.checkedIn as number
              }
            };
          }
          break;
        case 'onchain':
          if (changes.total !== undefined) {
            return {
              ...metrics,
              onchain: {
                ...metrics.onchain,
                transactions: {
                  ...metrics.onchain.transactions,
                  total: changes.total as number
                }
              }
            };
          }
          break;
        case 'social':
          if (changes.mentions !== undefined) {
            return {
              ...metrics,
              social: {
                ...metrics.social,
                mentions: changes.mentions as number
              }
            };
          }
          break;
      }
      return metrics;
    }, { ...currentMetrics });

    const finalMetrics = {
      ...updatedMetrics,
      lastUpdated: new Date().toISOString()
    };

    set({
      currentMetrics: finalMetrics,
      pendingUpdates: [],
      lastUpdateTime: new Date().toISOString()
    });
  },

  clearRealtimeUpdates: () => {
    set({ pendingUpdates: [] });
  },

  // View and filter management
  setSelectedView: (view) => set({ selectedView: view }),

  setTimeRange: (range) => set({ timeRange: range }),

  toggleCategory: (category) => {
    set((state) => {
      const categories = [...state.selectedCategories];
      const index = categories.indexOf(category);

      if (index >= 0) {
        // Remove category
        categories.splice(index, 1);
      } else {
        // Add category
        categories.push(category);
      }

      return { selectedCategories: categories };
    });
  },

  selectAllCategories: () => {
    set({ selectedCategories: [...ALL_CATEGORIES] });
  },

  // UI state
  setIsLoading: (loading) => set({ isLoading: loading }),
  setIsRefreshing: (refreshing) => set({ isRefreshing: refreshing }),
  setError: (error) => set({ error }),

  // Export
  startExport: (format) => set({ isExporting: true, exportFormat: format }),
  finishExport: () => set({ isExporting: false, exportFormat: null }),

  // Computed getters
  getFilteredMetrics: () => {
    const { currentMetrics, selectedCategories } = get();

    if (!currentMetrics) {
      return null;
    }

    const filtered: Partial<EventMetrics> = {
      eventId: currentMetrics.eventId,
      eventName: currentMetrics.eventName,
      lastUpdated: currentMetrics.lastUpdated
    };

    selectedCategories.forEach((category) => {
      switch (category) {
        case 'registration':
          filtered.registration = currentMetrics.registration;
          break;
        case 'attendance':
          filtered.attendance = currentMetrics.attendance;
          break;
        case 'onchain':
          filtered.onchain = currentMetrics.onchain;
          break;
        case 'social':
          filtered.social = currentMetrics.social;
          break;
      }
    });

    return filtered;
  },

  getMetricsSummary: () => {
    const { currentMetrics } = get();

    if (!currentMetrics) {
      return null;
    }

    return {
      totalRegistrations: currentMetrics.registration.total,
      totalAttendance: currentMetrics.attendance.checkedIn,
      conversionRate: currentMetrics.registration.conversionRate,
      totalTransactions: currentMetrics.onchain.transactions.total,
      totalWallets: currentMetrics.onchain.wallets.totalActive,
      socialEngagement: currentMetrics.social.mentions + currentMetrics.social.shares,
      lastUpdated: currentMetrics.lastUpdated
    };
  },

  hasMetrics: () => {
    const { currentMetrics } = get();
    return currentMetrics !== null;
  },

  // Reset
  reset: () => {
    const { realtimeInterval } = get();
    if (realtimeInterval) {
      clearInterval(realtimeInterval);
    }

    set({
      currentMetrics: null,
      metricsHistory: {},
      realtimeEnabled: false,
      realtimeInterval: null,
      pendingUpdates: [],
      selectedView: 'overview',
      timeRange: 'all',
      selectedCategories: [...ALL_CATEGORIES],
      isLoading: false,
      isRefreshing: false,
      error: null,
      lastUpdateTime: null,
      isExporting: false,
      exportFormat: null
    });
  }
}));
