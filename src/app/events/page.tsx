'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth-store';
import { useOrganizationStore } from '@/store/organization-store';
import EventDashboard from '@/components/events/EventDashboard';

export default function EventsPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const { selectedOrganization } = useOrganizationStore();

  useEffect(() => {
    // Check authentication
    if (!isAuthenticated) {
      alert('You must be logged in to view events');
      router.push('/auth');
      return;
    }

    // Check organization selection
    if (!selectedOrganization.organization) {
      alert('Please select an organization first');
      router.push('/dashboard');
      return;
    }
  }, [isAuthenticated, selectedOrganization, router]);

  if (!isAuthenticated || !selectedOrganization.organization) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin text-4xl mb-4">⏳</div>
          <p style={{ color: 'var(--foreground-secondary)' }}>Verifying access...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--background)' }}>
      <div className="main-content">
        {/* Header */}
        <div className="mb-8">
          <nav className="mb-4">
            <button
              onClick={() => router.back()}
              className="text-sm font-medium transition-colors hover:opacity-80"
              style={{ color: 'var(--accent-primary)' }}
            >
              ← Back
            </button>
          </nav>

          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-4xl font-bold mb-2" style={{ color: 'var(--foreground)' }}>
                Events Dashboard
              </h1>
              <p className="text-lg" style={{ color: 'var(--foreground-secondary)' }}>
                {selectedOrganization.organization.name}
              </p>
            </div>

            <div
              className="px-4 py-2 rounded-lg text-sm"
              style={{
                background: 'var(--accent-blue)',
                opacity: 0.8,
                color: 'white'
              }}
            >
              🎭 Demo Mode Active
            </div>
          </div>
        </div>

        {/* Dashboard */}
        <EventDashboard />
      </div>
    </div>
  );
}
