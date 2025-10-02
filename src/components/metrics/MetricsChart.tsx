'use client';

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

export type ChartType = 'line' | 'bar' | 'pie';

interface MetricsChartProps {
  type: ChartType;
  data: Record<string, string | number>[];
  title?: string;
  dataKey?: string;
  xKey?: string;
  yKey?: string;
  color?: string;
  colors?: string[];
  height?: number;
  showGrid?: boolean;
  showLegend?: boolean;
  className?: string;
}

const DEFAULT_COLORS = [
  'var(--accent-primary)',
  'var(--accent-blue)',
  'var(--success)',
  'var(--warning)',
  'var(--accent-gray)'
];

export default function MetricsChart({
  type,
  data,
  title,
  dataKey = 'value',
  xKey = 'name',
  color = 'var(--accent-primary)',
  colors,
  height = 300,
  showGrid = true,
  className = ''
}: MetricsChartProps) {
  const chartColors = colors || DEFAULT_COLORS;

  const customTooltipStyle = {
    background: 'var(--background)',
    border: '1px solid var(--accent-border)',
    borderRadius: 'var(--radius-md)',
    padding: 'var(--spacing-sm)',
    boxShadow: 'var(--shadow-md)'
  };

  const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ name: string; value: number; color: string }>; label?: string }) => {
    if (active && payload && payload.length) {
      return (
        <div style={customTooltipStyle}>
          <p style={{ margin: 0, color: 'var(--foreground)', fontWeight: '600', fontSize: '0.875rem' }}>
            {label}
          </p>
          {payload.map((entry: { name: string; value: number; color: string }, index: number) => (
            <p
              key={index}
              style={{
                margin: '4px 0 0 0',
                color: entry.color,
                fontSize: '0.875rem'
              }}
            >
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const renderChart = () => {
    switch (type) {
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <LineChart data={data}>
              {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="var(--accent-border)" />}
              <XAxis
                dataKey={xKey}
                stroke="var(--foreground-secondary)"
                style={{ fontSize: '0.75rem' }}
              />
              <YAxis
                stroke="var(--foreground-secondary)"
                style={{ fontSize: '0.75rem' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey={dataKey}
                stroke={color}
                strokeWidth={2}
                dot={{ fill: color, r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        );

      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <BarChart data={data}>
              {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="var(--accent-border)" />}
              <XAxis
                dataKey={xKey}
                stroke="var(--foreground-secondary)"
                style={{ fontSize: '0.75rem' }}
              />
              <YAxis
                stroke="var(--foreground-secondary)"
                style={{ fontSize: '0.75rem' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey={dataKey} fill={color} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        );

      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <PieChart>
              <Pie
                data={data}
                dataKey={dataKey}
                nameKey={xKey}
                cx="50%"
                cy="50%"
                outerRadius={80}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        );

      default:
        return null;
    }
  };

  return (
    <div className={className}>
      {title && (
        <h3
          style={{
            fontSize: '1rem',
            fontWeight: '600',
            color: 'var(--foreground)',
            margin: '0 0 var(--spacing-lg) 0'
          }}
        >
          {title}
        </h3>
      )}
      {renderChart()}
    </div>
  );
}
