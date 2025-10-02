'use client';

import { ComparisonMetrics } from '@/lib/mock-metrics';
import MetricsChart from './MetricsChart';

interface MetricsComparisonProps {
  comparisonData: ComparisonMetrics;
  currentEvent: {
    name: string;
    registrations: number;
    attendance: number;
    onchainActivity: number;
  };
  className?: string;
}

export default function MetricsComparison({
  comparisonData,
  currentEvent,
  className = ''
}: MetricsComparisonProps) {
  // Prepare data for comparison chart
  const comparisonChartData = [
    ...comparisonData.similarEvents.map(event => ({
      name: event.eventName,
      registrations: event.registrations,
      attendance: event.attendance,
      onchain: event.onchainActivity
    })),
    {
      name: `${currentEvent.name} (Current)`,
      registrations: currentEvent.registrations,
      attendance: currentEvent.attendance,
      onchain: currentEvent.onchainActivity
    }
  ];

  // Prepare data for averages comparison
  const averagesData = [
    { name: 'Current Event', value: currentEvent.registrations },
    { name: 'Similar Events Avg', value: comparisonData.averages.registrations }
  ];

  return (
    <div className={className}>
      {/* Percentile Badge */}
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 'var(--spacing-sm)',
          padding: 'var(--spacing-sm) var(--spacing-lg)',
          background: 'var(--success-light)',
          borderRadius: 'var(--radius-xl)',
          marginBottom: 'var(--spacing-xl)'
        }}
      >
        <span style={{ fontSize: '1.5rem' }}>🏆</span>
        <div>
          <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--foreground-secondary)' }}>
            Performance Percentile
          </p>
          <p
            style={{
              margin: 0,
              fontSize: '1.25rem',
              fontWeight: '700',
              color: 'var(--success)'
            }}
          >
            {comparisonData.percentile}th
          </p>
        </div>
      </div>

      {/* Comparison Chart */}
      <div
        className="card"
        style={{ marginBottom: 'var(--spacing-xl)' }}
      >
        <div className="card-header">
          <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: 'var(--foreground)', margin: 0 }}>
            Event Comparison
          </h3>
        </div>
        <div className="card-body">
          <MetricsChart
            type="bar"
            data={comparisonChartData}
            xKey="name"
            dataKey="registrations"
            color="var(--accent-primary)"
            height={300}
          />
        </div>
      </div>

      {/* Averages Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 'var(--spacing-lg)'
        }}
      >
        <div className="card">
          <div className="card-body">
            <p
              style={{
                margin: '0 0 var(--spacing-xs) 0',
                fontSize: '0.875rem',
                color: 'var(--foreground-secondary)'
              }}
            >
              Avg Registrations
            </p>
            <p
              style={{
                margin: 0,
                fontSize: '1.5rem',
                fontWeight: '700',
                color: 'var(--foreground)'
              }}
            >
              {comparisonData.averages.registrations}
            </p>
            <p
              style={{
                margin: 'var(--spacing-xs) 0 0 0',
                fontSize: '0.75rem',
                color: currentEvent.registrations > comparisonData.averages.registrations
                  ? 'var(--success)'
                  : 'var(--warning)'
              }}
            >
              You: {currentEvent.registrations} (
              {currentEvent.registrations > comparisonData.averages.registrations ? '+' : ''}
              {((currentEvent.registrations - comparisonData.averages.registrations) /
                comparisonData.averages.registrations *
                100
              ).toFixed(0)}
              %)
            </p>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <p
              style={{
                margin: '0 0 var(--spacing-xs) 0',
                fontSize: '0.875rem',
                color: 'var(--foreground-secondary)'
              }}
            >
              Avg Attendance
            </p>
            <p
              style={{
                margin: 0,
                fontSize: '1.5rem',
                fontWeight: '700',
                color: 'var(--foreground)'
              }}
            >
              {comparisonData.averages.attendance}
            </p>
            <p
              style={{
                margin: 'var(--spacing-xs) 0 0 0',
                fontSize: '0.75rem',
                color: currentEvent.attendance > comparisonData.averages.attendance
                  ? 'var(--success)'
                  : 'var(--warning)'
              }}
            >
              You: {currentEvent.attendance} (
              {currentEvent.attendance > comparisonData.averages.attendance ? '+' : ''}
              {((currentEvent.attendance - comparisonData.averages.attendance) /
                comparisonData.averages.attendance *
                100
              ).toFixed(0)}
              %)
            </p>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <p
              style={{
                margin: '0 0 var(--spacing-xs) 0',
                fontSize: '0.875rem',
                color: 'var(--foreground-secondary)'
              }}
            >
              Avg Conversion Rate
            </p>
            <p
              style={{
                margin: 0,
                fontSize: '1.5rem',
                fontWeight: '700',
                color: 'var(--foreground)'
              }}
            >
              {(comparisonData.averages.conversionRate * 100).toFixed(0)}%
            </p>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <p
              style={{
                margin: '0 0 var(--spacing-xs) 0',
                fontSize: '0.875rem',
                color: 'var(--foreground-secondary)'
              }}
            >
              Avg Social Engagement
            </p>
            <p
              style={{
                margin: 0,
                fontSize: '1.5rem',
                fontWeight: '700',
                color: 'var(--foreground)'
              }}
            >
              {comparisonData.averages.socialEngagement}
            </p>
          </div>
        </div>
      </div>

      {/* Similar Events List */}
      <div className="card" style={{ marginTop: 'var(--spacing-xl)' }}>
        <div className="card-header">
          <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: 'var(--foreground)', margin: 0 }}>
            Similar Events
          </h3>
        </div>
        <div className="card-body">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
            {comparisonData.similarEvents.map((event, index) => (
              <div
                key={index}
                style={{
                  padding: 'var(--spacing-md)',
                  background: 'var(--background-secondary)',
                  borderRadius: 'var(--radius-md)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div>
                  <p
                    style={{
                      margin: 0,
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      color: 'var(--foreground)'
                    }}
                  >
                    {event.eventName}
                  </p>
                </div>
                <div style={{ display: 'flex', gap: 'var(--spacing-lg)', fontSize: '0.75rem' }}>
                  <div>
                    <p style={{ margin: 0, color: 'var(--foreground-secondary)' }}>Registrations</p>
                    <p style={{ margin: 0, fontWeight: '600', color: 'var(--foreground)' }}>
                      {event.registrations}
                    </p>
                  </div>
                  <div>
                    <p style={{ margin: 0, color: 'var(--foreground-secondary)' }}>Attendance</p>
                    <p style={{ margin: 0, fontWeight: '600', color: 'var(--foreground)' }}>
                      {event.attendance}
                    </p>
                  </div>
                  <div>
                    <p style={{ margin: 0, color: 'var(--foreground-secondary)' }}>On-chain</p>
                    <p style={{ margin: 0, fontWeight: '600', color: 'var(--foreground)' }}>
                      {event.onchainActivity}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
