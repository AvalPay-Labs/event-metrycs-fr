'use client';

import { ReactNode } from 'react';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: ReactNode;
  trend?: {
    value: number;
    label: string;
    isPositive?: boolean;
  };
  color?: 'primary' | 'blue' | 'success' | 'warning' | 'neutral';
  className?: string;
}

export default function MetricCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  color = 'neutral',
  className = ''
}: MetricCardProps) {
  const colorStyles = {
    primary: {
      background: 'var(--accent-primary)',
      light: 'rgba(139, 92, 246, 0.1)'
    },
    blue: {
      background: 'var(--accent-blue)',
      light: 'rgba(59, 130, 246, 0.1)'
    },
    success: {
      background: 'var(--success)',
      light: 'var(--success-light)'
    },
    warning: {
      background: 'var(--warning)',
      light: 'var(--warning-light)'
    },
    neutral: {
      background: 'var(--foreground-secondary)',
      light: 'var(--background-secondary)'
    }
  };

  const currentColor = colorStyles[color];

  return (
    <div
      className={`card ${className}`}
      style={{
        borderLeft: `4px solid ${currentColor.background}`,
        transition: 'transform 0.2s ease, box-shadow 0.2s ease'
      }}
    >
      <div className="card-body" style={{ padding: 'var(--spacing-xl)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ flex: 1 }}>
            <p
              style={{
                fontSize: '0.875rem',
                fontWeight: '500',
                color: 'var(--foreground-secondary)',
                margin: '0 0 var(--spacing-sm) 0',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}
            >
              {title}
            </p>
            <p
              style={{
                fontSize: '2rem',
                fontWeight: '700',
                color: 'var(--foreground)',
                margin: '0 0 var(--spacing-xs) 0',
                lineHeight: 1.2
              }}
            >
              {value}
            </p>
            {subtitle && (
              <p
                style={{
                  fontSize: '0.875rem',
                  color: 'var(--foreground-light)',
                  margin: 0
                }}
              >
                {subtitle}
              </p>
            )}
            {trend && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--spacing-xs)',
                  marginTop: 'var(--spacing-sm)'
                }}
              >
                <span
                  style={{
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    color: trend.isPositive !== false ? 'var(--success)' : 'var(--error)'
                  }}
                >
                  {trend.isPositive !== false ? '↑' : '↓'} {Math.abs(trend.value)}%
                </span>
                <span
                  style={{
                    fontSize: '0.75rem',
                    color: 'var(--foreground-light)'
                  }}
                >
                  {trend.label}
                </span>
              </div>
            )}
          </div>
          {icon && (
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: 'var(--radius-lg)',
                background: currentColor.light,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem',
                color: currentColor.background
              }}
            >
              {icon}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
