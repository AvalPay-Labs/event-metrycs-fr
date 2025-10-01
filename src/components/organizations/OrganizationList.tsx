'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUserOrganizations } from '@/store/organization-store';
import { useAuthStore } from '@/store/auth-store';
import OrganizationCard from './OrganizationCard';
import JoinOrganizationModal from './JoinOrganizationModal';

export default function OrganizationList() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { organizations, isLoading, loadOrganizations, error } = useUserOrganizations();
  const [showJoinModal, setShowJoinModal] = useState(false);

  useEffect(() => {
    if (user?.id) {
      loadOrganizations(Number(user.id));
    }
  }, [user?.id, loadOrganizations]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-[var(--foreground)]">My Organizations</h2>
          <div className="text-sm text-[var(--foreground-secondary)]">Loading...</div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-[var(--background-secondary)] rounded-lg h-48 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-[var(--foreground)]">My Organizations</h2>
        <div className="bg-[var(--error-light)] border border-[var(--error)] rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <span className="text-[var(--error)]">⚠️</span>
            <p className="text-[var(--error)]">{error}</p>
          </div>
          <button
            onClick={() => user?.id && loadOrganizations(Number(user.id))}
            className="mt-2 text-sm text-[var(--error)] hover:text-[var(--error-light)] underline"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-[var(--foreground)]">My Organizations</h2>
          <p className="text-sm text-[var(--foreground-secondary)] mt-1">
            Organizations you&apos;re a member of
          </p>
        </div>
        <button
          onClick={() => setShowJoinModal(true)}
          className="btn btn-primary text-sm"
        >
          Join Organization
        </button>
      </div>

      {organizations.length === 0 ? (
        <div className="text-center py-12 bg-[var(--background-secondary)] rounded-lg border border-[var(--accent-border)]">
          <div className="text-4xl mb-4">🏢</div>
          <h3 className="text-lg font-medium text-[var(--foreground)] mb-2">
            No organizations yet
          </h3>
          <p className="text-[var(--foreground-secondary)] mb-4">
            You&apos;re not a member of any organizations. Join one to get started!
          </p>
          <button
            onClick={() => setShowJoinModal(true)}
            className="btn btn-primary"
          >
            Browse Organizations
          </button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {organizations.map((org) => (
            <OrganizationCard
              key={org.id}
              organization={org}
              onClick={() => {
                // Navigate to organization detail
                router.push(`/organizations/${org.id}`);
              }}
            />
          ))}
        </div>
      )}

      {showJoinModal && (
        <JoinOrganizationModal
          onClose={() => setShowJoinModal(false)}
          onJoinSuccess={() => {
            setShowJoinModal(false);
            if (user?.id) {
              loadOrganizations(Number(user.id));
            }
          }}
        />
      )}
    </div>
  );
}