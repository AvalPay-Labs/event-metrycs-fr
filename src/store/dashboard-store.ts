import { create } from 'zustand';
import { Event, EventStatus } from './event-store';

export type SortBy = 'date' | 'name' | 'attendees';
export type SortOrder = 'asc' | 'desc';

export interface DashboardMetrics {
  totalEvents: number;
  activeEvents: number;
  totalAttendees: number;
  nextEvent: Event | null;
}

export interface EventChartData {
  month: string;
  events: number;
}

interface DashboardStoreState {
  // Filters
  statusFilter: EventStatus | 'all';
  searchQuery: string;
  sortBy: SortBy;
  sortOrder: SortOrder;

  // Pagination
  currentPage: number;
  eventsPerPage: number;

  // Data
  events: Event[];
  filteredEvents: Event[];
  dashboardMetrics: DashboardMetrics | null;
  chartData: EventChartData[];

  // UI State
  isLoading: boolean;
  error: string | null;

  // Actions
  setStatusFilter: (status: EventStatus | 'all') => void;
  setSearchQuery: (query: string) => void;
  setSortBy: (sortBy: SortBy) => void;
  toggleSortOrder: () => void;
  setCurrentPage: (page: number) => void;

  setEvents: (events: Event[]) => void;
  setDashboardMetrics: (metrics: DashboardMetrics) => void;
  setChartData: (data: EventChartData[]) => void;
  setIsLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  // Computed actions
  applyFiltersAndSort: () => void;
  getPaginatedEvents: () => Event[];
  getTotalPages: () => number;

  // Reset
  resetFilters: () => void;
}

export const useDashboardStore = create<DashboardStoreState>((set, get) => ({
  // Initial state
  statusFilter: 'all',
  searchQuery: '',
  sortBy: 'date',
  sortOrder: 'desc',
  currentPage: 1,
  eventsPerPage: 9,
  events: [],
  filteredEvents: [],
  dashboardMetrics: null,
  chartData: [],
  isLoading: false,
  error: null,

  // Filter actions
  setStatusFilter: (status) => {
    set({ statusFilter: status, currentPage: 1 });
    get().applyFiltersAndSort();
  },

  setSearchQuery: (query) => {
    set({ searchQuery: query, currentPage: 1 });
    get().applyFiltersAndSort();
  },

  setSortBy: (sortBy) => {
    set({ sortBy });
    get().applyFiltersAndSort();
  },

  toggleSortOrder: () => {
    set((state) => ({ sortOrder: state.sortOrder === 'asc' ? 'desc' : 'asc' }));
    get().applyFiltersAndSort();
  },

  setCurrentPage: (page) => set({ currentPage: page }),

  // Data setters
  setEvents: (events) => {
    set({ events });
    get().applyFiltersAndSort();
  },

  setDashboardMetrics: (metrics) => set({ dashboardMetrics: metrics }),
  setChartData: (data) => set({ chartData: data }),
  setIsLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),

  // Apply filters and sorting
  applyFiltersAndSort: () => {
    const { events, statusFilter, searchQuery, sortBy, sortOrder } = get();

    let filtered = [...events];

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(event => event.status === statusFilter);
    }

    // Apply search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(event =>
        event.name.toLowerCase().includes(query) ||
        event.eventCode.toLowerCase().includes(query) ||
        event.description.toLowerCase().includes(query)
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case 'date':
          comparison = new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
          break;
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'attendees':
          comparison = a.registeredCount - b.registeredCount;
          break;
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });

    set({ filteredEvents: filtered });
  },

  // Get paginated events
  getPaginatedEvents: () => {
    const { filteredEvents, currentPage, eventsPerPage } = get();
    const startIndex = (currentPage - 1) * eventsPerPage;
    const endIndex = startIndex + eventsPerPage;
    return filteredEvents.slice(startIndex, endIndex);
  },

  // Get total pages
  getTotalPages: () => {
    const { filteredEvents, eventsPerPage } = get();
    return Math.ceil(filteredEvents.length / eventsPerPage);
  },

  // Reset filters
  resetFilters: () => {
    set({
      statusFilter: 'all',
      searchQuery: '',
      sortBy: 'date',
      sortOrder: 'desc',
      currentPage: 1
    });
    get().applyFiltersAndSort();
  }
}));
