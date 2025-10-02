'use client';

import { useDashboardStore, SortBy } from '@/store/dashboard-store';
import { EventStatus } from '@/store/event-store';

export default function EventFilters() {
  const {
    statusFilter,
    searchQuery,
    sortBy,
    sortOrder,
    setStatusFilter,
    setSearchQuery,
    setSortBy,
    toggleSortOrder,
    resetFilters
  } = useDashboardStore();

  const statusOptions: { value: EventStatus | 'all'; label: string }[] = [
    { value: 'all', label: 'All Events' },
    { value: 'draft', label: 'Drafts' },
    { value: 'published', label: 'Published' },
    { value: 'active', label: 'Active' },
    { value: 'finished', label: 'Finished' }
  ];

  const sortOptions: { value: SortBy; label: string }[] = [
    { value: 'date', label: 'Date' },
    { value: 'name', label: 'Name' },
    { value: 'attendees', label: 'Attendees' }
  ];

  return (
    <div
      className="p-4 rounded-lg space-y-4 md:space-y-0 md:flex md:items-center md:gap-4"
      style={{
        background: 'var(--background-secondary)',
        border: '1px solid var(--accent-border)'
      }}
    >
      {/* Search */}
      <div className="flex-1">
        <div className="relative">
          <span
            className="absolute left-3 top-1/2 -translate-y-1/2 text-lg"
            style={{ color: 'var(--foreground-secondary)' }}
          >
            🔍
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search events by name or code..."
            className="w-full pl-10 pr-4 py-2 rounded-lg transition-colors"
            style={{
              background: 'var(--background)',
              color: 'var(--foreground)',
              border: '1px solid var(--accent-border)',
              outline: 'none'
            }}
          />
        </div>
      </div>

      {/* Status Filter */}
      <div className="min-w-[160px]">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as EventStatus | 'all')}
          className="w-full px-4 py-2 rounded-lg transition-colors"
          style={{
            background: 'var(--background)',
            color: 'var(--foreground)',
            border: '1px solid var(--accent-border)',
            outline: 'none'
          }}
        >
          {statusOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Sort By */}
      <div className="min-w-[140px]">
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as SortBy)}
          className="w-full px-4 py-2 rounded-lg transition-colors"
          style={{
            background: 'var(--background)',
            color: 'var(--foreground)',
            border: '1px solid var(--accent-border)',
            outline: 'none'
          }}
        >
          {sortOptions.map(option => (
            <option key={option.value} value={option.value}>
              Sort: {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Sort Order Toggle */}
      <button
        onClick={toggleSortOrder}
        className="px-4 py-2 rounded-lg font-medium transition-colors"
        style={{
          background: 'var(--accent-primary)',
          color: 'white'
        }}
        title={`Sort ${sortOrder === 'asc' ? 'ascending' : 'descending'}`}
      >
        {sortOrder === 'asc' ? '↑' : '↓'}
      </button>

      {/* Reset Filters */}
      {(statusFilter !== 'all' || searchQuery !== '' || sortBy !== 'date' || sortOrder !== 'desc') && (
        <button
          onClick={resetFilters}
          className="px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap"
          style={{
            background: 'var(--background)',
            color: 'var(--foreground-secondary)',
            border: '1px solid var(--accent-border)'
          }}
        >
          Reset
        </button>
      )}
    </div>
  );
}
