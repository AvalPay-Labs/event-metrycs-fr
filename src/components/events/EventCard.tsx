'use client';

import Link from 'next/link';
import { Event } from '@/store/event-store';
import { EVENT_TYPES } from '@/lib/mock-events';

interface EventCardProps {
  event: Event;
}

export default function EventCard({ event }: EventCardProps) {
  const eventType = EVENT_TYPES.find(t => t.value === event.eventType);
  const capacityPercent = event.maxCapacity > 0
    ? Math.round((event.registeredCount / event.maxCapacity) * 100)
    : 0;

  const startDate = new Date(event.startDate);
  const now = new Date();
  const daysUntil = Math.ceil((startDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  const isUpcoming = daysUntil > 0 && daysUntil < 7;

  // Status badge colors
  const statusColors: Record<string, { bg: string; text: string }> = {
    draft: { bg: 'var(--accent-gray)', text: 'var(--foreground)' },
    published: { bg: 'var(--accent-blue)', text: 'white' },
    active: { bg: 'var(--success)', text: 'white' },
    finished: { bg: 'var(--foreground-secondary)', text: 'white' }
  };

  const statusColor = statusColors[event.status] || statusColors.draft;

  return (
    <div
      className="rounded-lg overflow-hidden transition-all hover:shadow-lg"
      style={{
        background: 'var(--background)',
        border: '1px solid var(--accent-border)'
      }}
    >
      {/* Card Header */}
      <div
        className="p-4"
        style={{
          background: 'var(--background-secondary)',
          borderBottom: '1px solid var(--accent-border)'
        }}
      >
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{eventType?.icon}</span>
            <div>
              <h3
                className="font-semibold text-lg line-clamp-1"
                style={{ color: 'var(--foreground)' }}
              >
                {event.name}
              </h3>
              <p className="text-sm" style={{ color: 'var(--foreground-secondary)' }}>
                {event.eventCode}
              </p>
            </div>
          </div>

          {/* Status Badge */}
          <span
            className="px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap"
            style={{
              background: statusColor.bg,
              color: statusColor.text
            }}
          >
            {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
          </span>
        </div>

        {/* Upcoming indicator */}
        {isUpcoming && (
          <div
            className="mt-2 px-3 py-1 rounded-full text-xs font-medium inline-flex items-center gap-1"
            style={{
              background: 'var(--warning-light)',
              color: 'var(--warning)',
              border: '1px solid var(--warning)'
            }}
          >
            🔔 Upcoming in {daysUntil} day{daysUntil !== 1 ? 's' : ''}
          </div>
        )}
      </div>

      {/* Card Body */}
      <div className="p-4 space-y-4">
        {/* Date and Time */}
        <div className="flex items-center gap-2">
          <span className="text-lg">📅</span>
          <div className="text-sm">
            <div style={{ color: 'var(--foreground)' }} className="font-medium">
              {startDate.toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              })}
            </div>
            <div style={{ color: 'var(--foreground-secondary)' }}>
              {startDate.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit'
              })}
            </div>
          </div>
        </div>

        {/* Location */}
        <div className="flex items-center gap-2">
          <span className="text-lg">
            {event.locationType === 'virtual' ? '💻' : event.locationType === 'hybrid' ? '🌐' : '📍'}
          </span>
          <div className="text-sm truncate" style={{ color: 'var(--foreground-secondary)' }}>
            {event.locationType === 'virtual'
              ? 'Virtual Event'
              : event.locationType === 'hybrid'
              ? 'Hybrid Event'
              : event.address || 'In-person Event'}
          </div>
        </div>

        {/* Metrics */}
        <div
          className="grid grid-cols-2 gap-3 p-3 rounded-lg"
          style={{
            background: 'var(--background-secondary)'
          }}
        >
          {/* Registered */}
          <div>
            <div className="text-xs mb-1" style={{ color: 'var(--foreground-light)' }}>
              Registered
            </div>
            <div className="font-bold" style={{ color: 'var(--foreground)' }}>
              {event.registeredCount}
              {event.maxCapacity > 0 && ` / ${event.maxCapacity}`}
            </div>
            {event.maxCapacity > 0 && (
              <div
                className="mt-1 h-1.5 rounded-full overflow-hidden"
                style={{ background: 'var(--accent-gray)' }}
              >
                <div
                  className="h-full transition-all"
                  style={{
                    width: `${Math.min(capacityPercent, 100)}%`,
                    background: capacityPercent >= 90 ? 'var(--success)' : capacityPercent >= 70 ? 'var(--warning)' : 'var(--accent-primary)'
                  }}
                />
              </div>
            )}
          </div>

          {/* Interested */}
          <div>
            <div className="text-xs mb-1" style={{ color: 'var(--foreground-light)' }}>
              Interested
            </div>
            <div className="font-bold" style={{ color: 'var(--foreground)' }}>
              {event.interestedCount}
            </div>
            <div className="text-xs mt-1" style={{ color: 'var(--foreground-secondary)' }}>
              {event.viewCount} views
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Link
            href={`/events/${event.id}`}
            className="flex-1 px-4 py-2 rounded-lg font-medium text-center transition-colors"
            style={{
              background: 'var(--accent-primary)',
              color: 'white'
            }}
          >
            View Details
          </Link>

          {event.status === 'draft' && (
            <button
              className="px-4 py-2 rounded-lg font-medium transition-colors"
              style={{
                background: 'var(--background-secondary)',
                color: 'var(--foreground)',
                border: '1px solid var(--accent-border)'
              }}
            >
              Edit
            </button>
          )}
        </div>
      </div>

      {/* DEMO indicator */}
      <div
        className="px-4 py-2 text-xs text-center"
        style={{
          background: 'var(--background-secondary)',
          color: 'var(--foreground-light)',
          borderTop: '1px solid var(--accent-border)'
        }}
      >
        🎭 DEMO DATA
      </div>
    </div>
  );
}
