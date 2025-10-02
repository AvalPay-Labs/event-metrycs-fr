'use client';

import { useEffect, useState } from 'react';
import { Event } from '@/store/event-store';
import { useMetricsStore, MetricsView } from '@/store/metrics-store';
import { useRealtimeMetrics } from '@/hooks/useRealtimeMetrics';
import MetricCard from './MetricCard';
import MetricsChart from './MetricsChart';
import MetricsComparison from './MetricsComparison';
import Button from '../ui/Button';

interface MetricsOverviewProps {
  event: Event;
}

export default function MetricsOverview({ event }: MetricsOverviewProps) {
  const {
    currentMetrics,
    selectedView,
    isLoading,
    isRefreshing,
    realtimeEnabled,
    setCurrentMetrics,
    setSelectedView,
    setIsLoading,
    setIsRefreshing,
    enableRealtime,
    disableRealtime,
    startExport
  } = useMetricsStore();

  const [error, setError] = useState<string | null>(null);

  // Real-time metrics hook
  const { refresh: refreshRealtime } = useRealtimeMetrics({
    eventId: event.id,
    enabled: realtimeEnabled,
    interval: 30000
  });

  // Fetch metrics on mount
  useEffect(() => {
    fetchMetrics();
    // Cleanup realtime on unmount
    return () => {
      disableRealtime();
    };
  }, [event.id]);

  const fetchMetrics = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`/api/events/${event.id}/metrics`);
      const data = await response.json();

      if (data.success) {
        setCurrentMetrics(data.metrics);
      } else {
        setError(data.error || 'Failed to load metrics');
      }
    } catch (err) {
      setError('Failed to fetch metrics');
      console.error('Error fetching metrics:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchMetrics();
    if (realtimeEnabled) {
      await refreshRealtime();
    }
    setIsRefreshing(false);
  };

  const handleExport = (format: 'csv' | 'pdf') => {
    startExport(format);
    exportMetrics(format);
  };

  const exportMetrics = async (format: 'csv' | 'pdf') => {
    try {
      const response = await fetch(`/api/events/${event.id}/metrics/export`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ format })
      });

      if (format === 'csv') {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `metrics-${event.eventCode}-${Date.now()}.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        const data = await response.json();
        if (data.success) {
          alert('PDF export generated successfully!');
        }
      }
    } catch (err) {
      console.error('Export error:', err);
      alert('Failed to export metrics');
    }
  };

  const toggleRealtime = () => {
    if (realtimeEnabled) {
      disableRealtime();
    } else {
      enableRealtime();
    }
  };

  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: 'var(--spacing-3xl)' }}>
        <div style={{ fontSize: '3rem', marginBottom: 'var(--spacing-lg)' }}>📊</div>
        <p style={{ color: 'var(--foreground-secondary)' }}>Loading metrics...</p>
      </div>
    );
  }

  if (error || !currentMetrics) {
    return (
      <div style={{ textAlign: 'center', padding: 'var(--spacing-3xl)' }}>
        <div style={{ fontSize: '3rem', marginBottom: 'var(--spacing-lg)' }}>⚠️</div>
        <p style={{ color: 'var(--error)', marginBottom: 'var(--spacing-lg)' }}>
          {error || 'No metrics available'}
        </p>
        <Button onClick={fetchMetrics}>Retry</Button>
      </div>
    );
  }

  const { registration, attendance, onchain, social, comparisonData } = currentMetrics;

  // View selector tabs
  const views: { key: MetricsView; label: string; icon: string }[] = [
    { key: 'overview', label: 'Overview', icon: '📊' },
    { key: 'registration', label: 'Registration', icon: '📝' },
    { key: 'attendance', label: 'Attendance', icon: '✅' },
    { key: 'onchain', label: 'On-Chain', icon: '⛓️' },
    { key: 'social', label: 'Social', icon: '📱' },
    { key: 'comparison', label: 'Comparison', icon: '📈' }
  ];

  return (
    <div>
      {/* Controls Bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 'var(--spacing-xl)',
          flexWrap: 'wrap',
          gap: 'var(--spacing-md)'
        }}
      >
        <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
          <Button onClick={handleRefresh} disabled={isRefreshing}>
            {isRefreshing ? '⏳ Refreshing...' : '🔄 Refresh'}
          </Button>
          <Button onClick={toggleRealtime} variant={realtimeEnabled ? 'primary' : 'secondary'}>
            {realtimeEnabled ? '⏸️ Pause Live' : '▶️ Enable Live'}
          </Button>
        </div>
        <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
          <Button onClick={() => handleExport('csv')} variant="secondary">
            📄 Export CSV
          </Button>
          <Button onClick={() => handleExport('pdf')} variant="secondary">
            📑 Export PDF
          </Button>
        </div>
      </div>

      {/* View Tabs */}
      <div
        style={{
          display: 'flex',
          gap: 'var(--spacing-sm)',
          marginBottom: 'var(--spacing-xl)',
          overflowX: 'auto',
          paddingBottom: 'var(--spacing-sm)'
        }}
      >
        {views.map(view => (
          <button
            key={view.key}
            onClick={() => setSelectedView(view.key)}
            style={{
              padding: 'var(--spacing-md) var(--spacing-lg)',
              borderRadius: 'var(--radius-md)',
              border: 'none',
              background:
                selectedView === view.key ? 'var(--accent-primary)' : 'var(--background-secondary)',
              color: selectedView === view.key ? 'white' : 'var(--foreground)',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '0.875rem',
              transition: 'all 0.2s ease',
              whiteSpace: 'nowrap'
            }}
          >
            {view.icon} {view.label}
          </button>
        ))}
      </div>

      {/* Overview View */}
      {selectedView === 'overview' && (
        <div>
          {/* Key Metrics Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: 'var(--spacing-lg)',
              marginBottom: 'var(--spacing-xl)'
            }}
          >
            <MetricCard
              title="Total Registrations"
              value={registration.total}
              subtitle={`${(registration.conversionRate * 100).toFixed(0)}% conversion`}
              icon="📝"
              color="primary"
            />
            <MetricCard
              title="Attendance"
              value={attendance.checkedIn}
              subtitle={`${attendance.peakAttendance} peak`}
              icon="✅"
              color="success"
            />
            <MetricCard
              title="On-Chain Transactions"
              value={onchain.transactions.total}
              subtitle={`${onchain.transactions.totalVolume} AVAX volume`}
              icon="⛓️"
              color="blue"
            />
            <MetricCard
              title="Social Mentions"
              value={social.mentions}
              subtitle={`${social.estimatedReach} estimated reach`}
              icon="📱"
              color="warning"
            />
          </div>

          {/* Charts Row */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
              gap: 'var(--spacing-lg)'
            }}
          >
            <div className="card">
              <div className="card-body">
                <MetricsChart
                  type="line"
                  data={registration.daily.map((count, index) => ({
                    name: `Day ${index + 1}`,
                    registrations: count
                  }))}
                  title="Registration Trend"
                  dataKey="registrations"
                  xKey="name"
                  color="var(--accent-primary)"
                  height={250}
                />
              </div>
            </div>

            <div className="card">
              <div className="card-body">
                <MetricsChart
                  type="pie"
                  data={[
                    { name: 'Web', value: registration.sources.web },
                    { name: 'Social', value: registration.sources.social },
                    { name: 'Email', value: registration.sources.email },
                    { name: 'Referral', value: registration.sources.referral }
                  ]}
                  title="Registration Sources"
                  dataKey="value"
                  xKey="name"
                  height={250}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Registration View */}
      {selectedView === 'registration' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: 'var(--spacing-lg)'
            }}
          >
            <MetricCard title="Total" value={registration.total} color="primary" />
            <MetricCard
              title="Conversion Rate"
              value={`${(registration.conversionRate * 100).toFixed(0)}%`}
              color="success"
            />
          </div>

          <div className="card">
            <div className="card-body">
              <MetricsChart
                type="bar"
                data={registration.geographicDistribution}
                title="Geographic Distribution"
                dataKey="count"
                xKey="country"
                color="var(--accent-blue)"
                height={300}
              />
            </div>
          </div>
        </div>
      )}

      {/* Attendance View */}
      {selectedView === 'attendance' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: 'var(--spacing-lg)'
            }}
          >
            <MetricCard title="Checked In" value={attendance.checkedIn} color="success" icon="✅" />
            <MetricCard
              title="Avg Duration"
              value={`${attendance.averageDuration}m`}
              subtitle="minutes"
              color="blue"
            />
            <MetricCard title="Peak Attendance" value={attendance.peakAttendance} color="primary" />
            <MetricCard
              title="No-Show Rate"
              value={`${(attendance.noShowRate * 100).toFixed(0)}%`}
              color="warning"
            />
          </div>

          {attendance.attendancePeaks.length > 0 && (
            <div className="card">
              <div className="card-body">
                <MetricsChart
                  type="line"
                  data={attendance.attendancePeaks}
                  title="Attendance by Time"
                  dataKey="count"
                  xKey="timeSlot"
                  color="var(--success)"
                  height={300}
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* On-Chain View */}
      {selectedView === 'onchain' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: 'var(--spacing-lg)'
            }}
          >
            <MetricCard title="New Wallets" value={onchain.wallets.newCreated} color="primary" />
            <MetricCard title="Reactivated" value={onchain.wallets.reactivated} color="blue" />
            <MetricCard title="Total Active" value={onchain.wallets.totalActive} color="success" />
            <MetricCard title="Transactions" value={onchain.transactions.total} color="warning" />
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
              gap: 'var(--spacing-lg)'
            }}
          >
            <div className="card">
              <div className="card-body">
                <MetricsChart
                  type="bar"
                  data={[
                    { name: 'Transfers', value: onchain.transactions.types.transfers },
                    { name: 'Swaps', value: onchain.transactions.types.swaps },
                    { name: 'Contracts', value: onchain.transactions.types.contracts }
                  ]}
                  title="Transaction Types"
                  dataKey="value"
                  xKey="name"
                  color="var(--accent-primary)"
                  height={250}
                />
              </div>
            </div>

            <div className="card">
              <div className="card-body">
                <MetricsChart
                  type="pie"
                  data={[
                    { name: 'POAPs', value: onchain.nfts.poaps },
                    { name: 'Certificates', value: onchain.nfts.certificates },
                    { name: 'Collectibles', value: onchain.nfts.collectibles }
                  ]}
                  title="NFT Distribution"
                  dataKey="value"
                  xKey="name"
                  height={250}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Social View */}
      {selectedView === 'social' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: 'var(--spacing-lg)'
            }}
          >
            <MetricCard title="Mentions" value={social.mentions} color="primary" />
            <MetricCard title="Shares" value={social.shares} color="blue" />
            <MetricCard title="Hashtag Usage" value={social.hashtagUsage} color="warning" />
            <MetricCard title="Estimated Reach" value={social.estimatedReach} color="success" />
          </div>

          <div className="card">
            <div className="card-body">
              <MetricsChart
                type="pie"
                data={[
                  { name: 'Positive', value: social.sentiment.positive },
                  { name: 'Neutral', value: social.sentiment.neutral },
                  { name: 'Negative', value: social.sentiment.negative }
                ]}
                title="Sentiment Analysis"
                dataKey="value"
                xKey="name"
                colors={['var(--success)', 'var(--foreground-secondary)', 'var(--error)']}
                height={300}
              />
            </div>
          </div>
        </div>
      )}

      {/* Comparison View */}
      {selectedView === 'comparison' && comparisonData && (
        <MetricsComparison
          comparisonData={comparisonData}
          currentEvent={{
            name: event.name,
            registrations: registration.total,
            attendance: attendance.checkedIn,
            onchainActivity: onchain.transactions.total
          }}
        />
      )}
    </div>
  );
}
