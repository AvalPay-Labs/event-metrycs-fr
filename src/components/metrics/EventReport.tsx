'use client';

import { EventReport as EventReportType } from '@/lib/report-generator';
import Button from '../ui/Button';

interface EventReportProps {
  report: EventReportType;
  onExport?: () => void;
  onClose?: () => void;
}

export default function EventReport({ report, onExport, onClose }: EventReportProps) {
  const eventDate = new Date(report.event.startDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      {/* Header */}
      <div
        className="card"
        style={{
          marginBottom: 'var(--spacing-xl)',
          background: 'linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-blue) 100%)',
          color: 'white'
        }}
      >
        <div className="card-body" style={{ padding: 'var(--spacing-2xl)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p style={{ margin: 0, fontSize: '0.875rem', opacity: 0.9 }}>Post-Event Report</p>
              <h1
                style={{
                  margin: 'var(--spacing-sm) 0',
                  fontSize: '2rem',
                  fontWeight: '700'
                }}
              >
                {report.event.name}
              </h1>
              <div style={{ fontSize: '0.875rem', opacity: 0.9 }}>
                <p style={{ margin: 0 }}>
                  {report.event.eventCode} • {report.event.eventType} • {eventDate}
                </p>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div
                style={{
                  fontSize: '3rem',
                  fontWeight: '700',
                  lineHeight: 1
                }}
              >
                {report.comparison.percentile}
                <span style={{ fontSize: '1.5rem' }}>th</span>
              </div>
              <p style={{ margin: 'var(--spacing-xs) 0 0 0', fontSize: '0.875rem', opacity: 0.9 }}>
                Percentile
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 'var(--spacing-lg)',
          marginBottom: 'var(--spacing-xl)'
        }}
      >
        <div className="card">
          <div className="card-body">
            <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--foreground-secondary)' }}>
              Registrations
            </p>
            <p
              style={{
                margin: 'var(--spacing-xs) 0',
                fontSize: '2rem',
                fontWeight: '700',
                color: 'var(--foreground)'
              }}
            >
              {report.summary.totalRegistrations}
            </p>
            <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--success)' }}>
              {report.comparison.vsAverage.registrations} vs avg
            </p>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--foreground-secondary)' }}>
              Attendance
            </p>
            <p
              style={{
                margin: 'var(--spacing-xs) 0',
                fontSize: '2rem',
                fontWeight: '700',
                color: 'var(--foreground)'
              }}
            >
              {report.summary.totalAttendance}
            </p>
            <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--success)' }}>
              {report.comparison.vsAverage.attendance} vs avg
            </p>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--foreground-secondary)' }}>
              Conversion Rate
            </p>
            <p
              style={{
                margin: 'var(--spacing-xs) 0',
                fontSize: '2rem',
                fontWeight: '700',
                color: 'var(--foreground)'
              }}
            >
              {(report.summary.conversionRate * 100).toFixed(0)}%
            </p>
            <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--foreground-light)' }}>
              {(report.summary.noShowRate * 100).toFixed(0)}% no-show
            </p>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--foreground-secondary)' }}>
              Avg Duration
            </p>
            <p
              style={{
                margin: 'var(--spacing-xs) 0',
                fontSize: '2rem',
                fontWeight: '700',
                color: 'var(--foreground)'
              }}
            >
              {Math.floor(report.summary.averageDuration)}m
            </p>
            <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--foreground-light)' }}>
              minutes
            </p>
          </div>
        </div>
      </div>

      {/* Highlights */}
      <div className="card" style={{ marginBottom: 'var(--spacing-xl)' }}>
        <div className="card-header">
          <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '700' }}>
            ✨ Highlights
          </h3>
        </div>
        <div className="card-body">
          <ul style={{ margin: 0, paddingLeft: 'var(--spacing-xl)' }}>
            {report.highlights.map((highlight, index) => (
              <li
                key={index}
                style={{
                  marginBottom: 'var(--spacing-md)',
                  color: 'var(--foreground)',
                  lineHeight: 1.6
                }}
              >
                {highlight}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Areas for Improvement */}
      {report.lowlights.length > 0 && (
        <div className="card" style={{ marginBottom: 'var(--spacing-xl)' }}>
          <div className="card-header">
            <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '700' }}>
              📊 Areas for Improvement
            </h3>
          </div>
          <div className="card-body">
            <ul style={{ margin: 0, paddingLeft: 'var(--spacing-xl)' }}>
              {report.lowlights.map((lowlight, index) => (
                <li
                  key={index}
                  style={{
                    marginBottom: 'var(--spacing-md)',
                    color: 'var(--foreground)',
                    lineHeight: 1.6
                  }}
                >
                  {lowlight}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Recommendations */}
      <div className="card" style={{ marginBottom: 'var(--spacing-xl)' }}>
        <div className="card-header">
          <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '700' }}>
            💡 AI-Generated Recommendations
          </h3>
        </div>
        <div className="card-body">
          <ul style={{ margin: 0, paddingLeft: 'var(--spacing-xl)' }}>
            {report.recommendations.map((recommendation, index) => (
              <li
                key={index}
                style={{
                  marginBottom: 'var(--spacing-md)',
                  color: 'var(--foreground)',
                  lineHeight: 1.6
                }}
              >
                {recommendation}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Detailed Metrics */}
      <div className="card" style={{ marginBottom: 'var(--spacing-xl)' }}>
        <div className="card-header">
          <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '700' }}>
            📈 Detailed Metrics
          </h3>
        </div>
        <div className="card-body">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: 'var(--spacing-xl)'
            }}
          >
            {/* Registration Metrics */}
            <div>
              <h4
                style={{
                  margin: '0 0 var(--spacing-md) 0',
                  fontSize: '1rem',
                  fontWeight: '600',
                  color: 'var(--foreground)'
                }}
              >
                Registration
              </h4>
              <div style={{ fontSize: '0.875rem' }}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: 'var(--spacing-sm)'
                  }}
                >
                  <span style={{ color: 'var(--foreground-secondary)' }}>Web:</span>
                  <span style={{ fontWeight: '600' }}>{report.metrics.registration.sources.web}%</span>
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: 'var(--spacing-sm)'
                  }}
                >
                  <span style={{ color: 'var(--foreground-secondary)' }}>Social:</span>
                  <span style={{ fontWeight: '600' }}>{report.metrics.registration.sources.social}%</span>
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: 'var(--spacing-sm)'
                  }}
                >
                  <span style={{ color: 'var(--foreground-secondary)' }}>Email:</span>
                  <span style={{ fontWeight: '600' }}>{report.metrics.registration.sources.email}%</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--foreground-secondary)' }}>Referral:</span>
                  <span style={{ fontWeight: '600' }}>{report.metrics.registration.sources.referral}%</span>
                </div>
              </div>
            </div>

            {/* On-Chain Metrics */}
            <div>
              <h4
                style={{
                  margin: '0 0 var(--spacing-md) 0',
                  fontSize: '1rem',
                  fontWeight: '600',
                  color: 'var(--foreground)'
                }}
              >
                On-Chain Activity
              </h4>
              <div style={{ fontSize: '0.875rem' }}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: 'var(--spacing-sm)'
                  }}
                >
                  <span style={{ color: 'var(--foreground-secondary)' }}>New Wallets:</span>
                  <span style={{ fontWeight: '600' }}>{report.metrics.onchain.newWallets}</span>
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: 'var(--spacing-sm)'
                  }}
                >
                  <span style={{ color: 'var(--foreground-secondary)' }}>Transactions:</span>
                  <span style={{ fontWeight: '600' }}>{report.metrics.onchain.totalTransactions}</span>
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: 'var(--spacing-sm)'
                  }}
                >
                  <span style={{ color: 'var(--foreground-secondary)' }}>Volume:</span>
                  <span style={{ fontWeight: '600' }}>{report.metrics.onchain.totalVolume} AVAX</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--foreground-secondary)' }}>NFTs Minted:</span>
                  <span style={{ fontWeight: '600' }}>{report.metrics.onchain.nftsMinted}</span>
                </div>
              </div>
            </div>

            {/* Social Metrics */}
            <div>
              <h4
                style={{
                  margin: '0 0 var(--spacing-md) 0',
                  fontSize: '1rem',
                  fontWeight: '600',
                  color: 'var(--foreground)'
                }}
              >
                Social Impact
              </h4>
              <div style={{ fontSize: '0.875rem' }}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: 'var(--spacing-sm)'
                  }}
                >
                  <span style={{ color: 'var(--foreground-secondary)' }}>Mentions:</span>
                  <span style={{ fontWeight: '600' }}>{report.metrics.social.mentions}</span>
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: 'var(--spacing-sm)'
                  }}
                >
                  <span style={{ color: 'var(--foreground-secondary)' }}>Shares:</span>
                  <span style={{ fontWeight: '600' }}>{report.metrics.social.shares}</span>
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: 'var(--spacing-sm)'
                  }}
                >
                  <span style={{ color: 'var(--foreground-secondary)' }}>Reach:</span>
                  <span style={{ fontWeight: '600' }}>{report.metrics.social.reach.toLocaleString()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--foreground-secondary)' }}>Sentiment:</span>
                  <span style={{ fontWeight: '600' }}>{report.metrics.social.sentimentScore}/100</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div
        style={{
          display: 'flex',
          gap: 'var(--spacing-md)',
          justifyContent: 'center',
          marginTop: 'var(--spacing-2xl)'
        }}
      >
        {onExport && (
          <Button onClick={onExport} variant="primary">
            📄 Export Report
          </Button>
        )}
        {onClose && (
          <Button onClick={onClose} variant="secondary">
            Close
          </Button>
        )}
      </div>

      {/* Footer */}
      <div
        style={{
          textAlign: 'center',
          marginTop: 'var(--spacing-2xl)',
          paddingTop: 'var(--spacing-xl)',
          borderTop: '1px solid var(--accent-border)',
          fontSize: '0.75rem',
          color: 'var(--foreground-light)'
        }}
      >
        <p style={{ margin: 0 }}>
          Report generated on {new Date(report.generatedAt).toLocaleString()}
        </p>
        <p style={{ margin: 'var(--spacing-xs) 0 0 0' }}>
          EventMetrics Platform • Powered by Avalanche
        </p>
      </div>
    </div>
  );
}
