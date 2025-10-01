'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth-store';
import { useOrganizationStore } from '@/store/organization-store';
import EventCreationWizard from '@/components/events/EventCreationWizard';

export default function CreateEventPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const { selectedOrganization } = useOrganizationStore();
  const userRole = selectedOrganization.userRole;

  useEffect(() => {
    // Check authentication
    if (!isAuthenticated) {
      alert('You must be logged in to create an event');
      router.push('/auth/login');
      return;
    }

    // Check organization selection
    if (!selectedOrganization.organization) {
      alert('Please select an organization first');
      router.push('/dashboard');
      return;
    }

    // Check role permissions (Admin or Ambassador)
    if (userRole !== 'admin' && userRole !== 'ambassador' && userRole !== 'super_admin') {
      alert('You do not have permission to create events. Only Admins and Ambassadors can create events.');
      router.push(`/organizations/${selectedOrganization.organization.id}`);
      return;
    }
  }, [isAuthenticated, selectedOrganization, userRole, router]);

  if (!isAuthenticated || !selectedOrganization.organization || (userRole !== 'admin' && userRole !== 'ambassador' && userRole !== 'super_admin')) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin text-4xl mb-4">⏳</div>
          <p style={{ color: 'var(--foreground-secondary)' }}>Verifying permissions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--background)' }}>
      <div className="main-content">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="mb-4 text-sm font-medium transition-colors hover:opacity-80"
            style={{ color: 'var(--accent-primary)' }}
          >
            ← Back
          </button>
          <h1 className="text-4xl font-bold mb-2" style={{ color: 'var(--foreground)' }}>
            Create New Event
          </h1>
          <p className="text-lg" style={{ color: 'var(--foreground-secondary)' }}>
            for {selectedOrganization.organization.name}
          </p>
        </div>

        {/* Wizard Card */}
        <div
          className="rounded-lg shadow-lg"
          style={{
            background: 'var(--background)',
            border: '1px solid var(--accent-border)'
          }}
        >
          <div
            className="card-header"
            style={{
              background: 'var(--background-secondary)',
              padding: 'var(--spacing-xl)',
              borderBottom: '1px solid var(--accent-border)'
            }}
          >
            <h2 className="text-xl font-semibold" style={{ color: 'var(--foreground)' }}>
              Event Creation Wizard
            </h2>
            <p className="text-sm mt-1" style={{ color: 'var(--foreground-secondary)' }}>
              Fill in the details below to create your event. Your progress is automatically saved.
            </p>
          </div>

          <EventCreationWizard />
        </div>

        {/* Help Section */}
        <div
          className="mt-6 p-4 rounded-lg"
          style={{
            background: 'var(--background-secondary)',
            border: '1px solid var(--accent-border)'
          }}
        >
          <p className="text-sm" style={{ color: 'var(--foreground-secondary)' }}>
            <strong>💡 Tip:</strong> Your progress is automatically saved as you fill out the form.
            You can safely leave this page and return later to continue.
          </p>
        </div>
      </div>
    </div>
  );
}
