'use client';

import { useDashboardStore } from '@/store/dashboard-store';

export default function EventMetrics() {
  const { dashboardMetrics, chartData } = useDashboardStore();

  if (!dashboardMetrics) {
    return null;
  }

  const nextEventDate = dashboardMetrics.nextEvent
    ? new Date(dashboardMetrics.nextEvent.startDate).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })
    : 'None scheduled';

  // Calculate max for chart scaling
  const maxEvents = Math.max(...chartData.map(d => d.events), 1);

  return (
    <div className="space-y-6">
      {/* Summary Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Events */}
        <div
          className="p-4 rounded-lg"
          style={{
            background: 'var(--background-secondary)',
            border: '1px solid var(--accent-border)'
          }}
        >
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">📊</span>
            <div>
              <div className="text-sm" style={{ color: 'var(--foreground-secondary)' }}>
                Total Events
              </div>
              <div className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>
                {dashboardMetrics.totalEvents}
              </div>
            </div>
          </div>
        </div>

        {/* Active Events */}
        <div
          className="p-4 rounded-lg"
          style={{
            background: 'var(--background-secondary)',
            border: '1px solid var(--accent-border)'
          }}
        >
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">🔴</span>
            <div>
              <div className="text-sm" style={{ color: 'var(--foreground-secondary)' }}>
                Active Events
              </div>
              <div className="text-2xl font-bold" style={{ color: 'var(--success)' }}>
                {dashboardMetrics.activeEvents}
              </div>
            </div>
          </div>
        </div>

        {/* Total Attendees */}
        <div
          className="p-4 rounded-lg"
          style={{
            background: 'var(--background-secondary)',
            border: '1px solid var(--accent-border)'
          }}
        >
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">👥</span>
            <div>
              <div className="text-sm" style={{ color: 'var(--foreground-secondary)' }}>
                Total Attendees
              </div>
              <div className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>
                {dashboardMetrics.totalAttendees}
              </div>
            </div>
          </div>
        </div>

        {/* Next Event */}
        <div
          className="p-4 rounded-lg"
          style={{
            background: 'var(--background-secondary)',
            border: '1px solid var(--accent-border)'
          }}
        >
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">📅</span>
            <div>
              <div className="text-sm" style={{ color: 'var(--foreground-secondary)' }}>
                Next Event
              </div>
              <div className="text-lg font-medium" style={{ color: 'var(--foreground)' }}>
                {dashboardMetrics.nextEvent?.name || 'None'}
              </div>
              <div className="text-xs" style={{ color: 'var(--foreground-light)' }}>
                {nextEventDate}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Simple Bar Chart - Events by Month */}
      {chartData.length > 0 && (
        <div
          className="p-6 rounded-lg"
          style={{
            background: 'var(--background-secondary)',
            border: '1px solid var(--accent-border)'
          }}
        >
          <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--foreground)' }}>
            Events Created (Last 6 Months)
          </h3>

          <div className="space-y-3">
            {chartData.map((data, index) => (
              <div key={index} className="flex items-center gap-3">
                <div
                  className="text-sm font-medium w-24 text-right"
                  style={{ color: 'var(--foreground-secondary)' }}
                >
                  {data.month}
                </div>

                <div className="flex-1 flex items-center gap-2">
                  <div
                    className="h-8 rounded transition-all"
                    style={{
                      width: `${(data.events / maxEvents) * 100}%`,
                      minWidth: data.events > 0 ? '24px' : '0',
                      background: 'var(--accent-primary)'
                    }}
                  />
                  <span
                    className="text-sm font-medium"
                    style={{ color: 'var(--foreground)' }}
                  >
                    {data.events}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Chart Legend */}
          <div className="mt-4 pt-4" style={{ borderTop: '1px solid var(--accent-border)' }}>
            <p className="text-xs text-center" style={{ color: 'var(--foreground-light)' }}>
              🎭 Chart shows mock event creation distribution
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
