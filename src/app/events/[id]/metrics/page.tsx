'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth-store';
import { Event } from '@/store/event-store';
import { MetricsOverview } from '@/components/metrics';

export default function EventMetricsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [event, setEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check authentication
    if (!isAuthenticated) {
      alert('You must be logged in to view event metrics');
      router.push('/auth');
      return;
    }

    fetchEvent();
  }, [isAuthenticated, resolvedParams.id]);

  const fetchEvent = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Load events from storage (in a real app, this would be an API call)
      const stored = localStorage.getItem('eventmetrics_events');
      if (stored) {
        const events: Event[] = JSON.parse(stored);
        const foundEvent = events.find(e => e.id === resolvedParams.id);

        if (foundEvent) {
          setEvent(foundEvent);
        } else {
          setError('Event not found');
        }
      } else {
        setError('No events found');
      }
    } catch (err) {
      setError('Failed to load event');
      console.error('Error loading event:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin text-4xl mb-4">⏳</div>
          <p style={{ color: 'var(--foreground-secondary)' }}>Verifying access...</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin text-4xl mb-4">⏳</div>
          <p style={{ color: 'var(--foreground-secondary)' }}>Loading event...</p>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div style={{ fontSize: '4rem', marginBottom: 'var(--spacing-lg)' }}>⚠️</div>
          <h2
            style={{
              fontSize: '1.5rem',
              fontWeight: '700',
              color: 'var(--foreground)',
              marginBottom: 'var(--spacing-md)'
            }}
          >
            {error || 'Event not found'}
          </h2>
          <button
            onClick={() => router.push('/events')}
            style={{
              padding: 'var(--spacing-md) var(--spacing-xl)',
              borderRadius: 'var(--radius-md)',
              background: 'var(--accent-primary)',
              color: 'white',
              border: 'none',
              cursor: 'pointer',
              fontWeight: '600'
            }}
          >
            Back to Events
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--background)' }}>
      <div className="main-content">
        {/* Header */}
        <div style={{ marginBottom: 'var(--spacing-xl)' }}>
          <nav style={{ marginBottom: 'var(--spacing-md)' }}>
            <button
              onClick={() => router.push('/events')}
              className="text-sm font-medium transition-colors hover:opacity-80"
              style={{ color: 'var(--accent-primary)', border: 'none', background: 'none', cursor: 'pointer' }}
            >
              ← Back to Events
            </button>
          </nav>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'var(--spacing-lg)' }}>
            <div>
              <h1
                style={{
                  fontSize: '2.5rem',
                  fontWeight: '700',
                  color: 'var(--foreground)',
                  marginBottom: 'var(--spacing-xs)'
                }}
              >
                📊 Event Metrics
              </h1>
              <h2
                style={{
                  fontSize: '1.5rem',
                  fontWeight: '600',
                  color: 'var(--foreground-secondary)',
                  marginBottom: 'var(--spacing-xs)'
                }}
              >
                {event.name}
              </h2>
              <div style={{ display: 'flex', gap: 'var(--spacing-md)', fontSize: '0.875rem', color: 'var(--foreground-light)' }}>
                <span>Code: {event.eventCode}</span>
                <span>•</span>
                <span>Type: {event.eventType}</span>
                <span>•</span>
                <span>Status: {event.status}</span>
              </div>
            </div>

            <div
              style={{
                padding: 'var(--spacing-md) var(--spacing-lg)',
                borderRadius: 'var(--radius-md)',
                background: 'var(--accent-blue)',
                opacity: 0.8,
                color: 'white',
                fontSize: '0.875rem',
                fontWeight: '600'
              }}
            >
              🎭 Demo Mode Active
            </div>
          </div>
        </div>

        {/* Metrics Overview */}
        <MetricsOverview event={event} />
      </div>
    </div>
  );
}
