'use client';

import { useEffect } from 'react';
import { useOrganizationStore } from '@/store/organization-store';
import { useDashboardStore } from '@/store/dashboard-store';
import EventMetrics from './EventMetrics';
import EventFilters from './EventFilters';
import EventCard from './EventCard';
import Link from 'next/link';

export default function EventDashboard() {
  const { selectedOrganization } = useOrganizationStore();
  const {
    isLoading,
    error,
    filteredEvents,
    currentPage,
    setEvents,
    setDashboardMetrics,
    setChartData,
    setIsLoading,
    setError,
    getPaginatedEvents,
    getTotalPages,
    setCurrentPage
  } = useDashboardStore();

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!selectedOrganization.organization) return;

      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `/api/events/dashboard?organizationId=${selectedOrganization.organization.id}`
        );

        const data = await response.json();

        if (data.success) {
          setEvents(data.events);
          setDashboardMetrics(data.metrics);
          setChartData(data.chartData);
        } else {
          setError('Failed to load dashboard data');
        }
      } catch (err) {
        console.error('Dashboard fetch error:', err);
        setError('An error occurred while loading the dashboard');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [selectedOrganization.organization, setEvents, setDashboardMetrics, setChartData, setIsLoading, setError]);

  const paginatedEvents = getPaginatedEvents();
  const totalPages = getTotalPages();

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Skeleton for metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div
              key={i}
              className="h-24 rounded-lg animate-pulse"
              style={{ background: 'var(--background-secondary)' }}
            />
          ))}
        </div>

        {/* Skeleton for filters */}
        <div
          className="h-16 rounded-lg animate-pulse"
          style={{ background: 'var(--background-secondary)' }}
        />

        {/* Skeleton for event cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div
              key={i}
              className="h-96 rounded-lg animate-pulse"
              style={{ background: 'var(--background-secondary)' }}
            />
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div
        className="p-8 rounded-lg text-center"
        style={{
          background: 'var(--error-light)',
          border: '1px solid var(--error)'
        }}
      >
        <div className="text-4xl mb-4">⚠️</div>
        <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--foreground)' }}>
          Error Loading Dashboard
        </h3>
        <p style={{ color: 'var(--foreground-secondary)' }}>{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-6 py-2 rounded-lg font-medium"
          style={{
            background: 'var(--accent-primary)',
            color: 'white'
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  // Empty state
  if (filteredEvents.length === 0 && !isLoading) {
    return (
      <div className="space-y-6">
        <EventMetrics />

        <div
          className="p-12 rounded-lg text-center"
          style={{
            background: 'var(--background-secondary)',
            border: '1px solid var(--accent-border)'
          }}
        >
          <div className="text-6xl mb-4">📅</div>
          <h3 className="text-2xl font-semibold mb-2" style={{ color: 'var(--foreground)' }}>
            No Events Found
          </h3>
          <p className="mb-6" style={{ color: 'var(--foreground-secondary)' }}>
            {selectedOrganization.organization
              ? "You haven't created any events yet. Get started by creating your first event!"
              : 'Please select an organization to view events.'}
          </p>

          {selectedOrganization.organization && (
            <Link
              href="/events/create"
              className="inline-block px-6 py-3 rounded-lg font-medium"
              style={{
                background: 'var(--accent-primary)',
                color: 'white'
              }}
            >
              ➕ Create Your First Event
            </Link>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Metrics Summary */}
      <EventMetrics />

      {/* Filters */}
      <EventFilters />

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p style={{ color: 'var(--foreground-secondary)' }}>
          Showing {paginatedEvents.length} of {filteredEvents.length} event
          {filteredEvents.length !== 1 ? 's' : ''}
        </p>

        {selectedOrganization.organization && selectedOrganization.userRole &&
          (selectedOrganization.userRole === 'admin' ||
            selectedOrganization.userRole === 'ambassador' ||
            selectedOrganization.userRole === 'super_admin') && (
          <Link
            href="/events/create"
            className="px-4 py-2 rounded-lg font-medium transition-colors"
            style={{
              background: 'var(--accent-primary)',
              color: 'white'
            }}
          >
            ➕ Create Event
          </Link>
        )}
      </div>

      {/* Event Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedEvents.map(event => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
            style={{
              background: 'var(--background-secondary)',
              color: 'var(--foreground)',
              border: '1px solid var(--accent-border)'
            }}
          >
            Previous
          </button>

          <div className="flex gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className="px-4 py-2 rounded-lg font-medium transition-colors"
                style={{
                  background: page === currentPage ? 'var(--accent-primary)' : 'var(--background-secondary)',
                  color: page === currentPage ? 'white' : 'var(--foreground)',
                  border: `1px solid ${page === currentPage ? 'var(--accent-primary)' : 'var(--accent-border)'}`
                }}
              >
                {page}
              </button>
            ))}
          </div>

          <button
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
            style={{
              background: 'var(--background-secondary)',
              color: 'var(--foreground)',
              border: '1px solid var(--accent-border)'
            }}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
