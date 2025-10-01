'use client';

import { useEffect, useState } from 'react';
import { usePublicOrganizations } from '@/store/organization-store';
import { useAuthStore } from '@/store/auth-store';
import { Organization } from '@/lib/mock-organizations';

interface JoinOrganizationModalProps {
  onClose: () => void;
  onJoinSuccess: () => void;
}

export default function JoinOrganizationModal({
  onClose,
  onJoinSuccess
}: JoinOrganizationModalProps) {
  const { user } = useAuthStore();
  const {
    organizations,
    isLoading,
    loadOrganizations,
    requestToJoin,
    isJoining,
    joinRequests,
    error
  } = usePublicOrganizations();

  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);
  const [joinMessage, setJoinMessage] = useState<string | null>(null);

  useEffect(() => {
    loadOrganizations();
  }, [loadOrganizations]);

  const handleJoinRequest = async (org: Organization) => {
    if (!user?.id) return;

    setSelectedOrg(org);
    const result = await requestToJoin(org.id, Number(user.id));

    if (result.success) {
      setJoinMessage(result.message);
      setTimeout(() => {
        onJoinSuccess();
      }, 2000);
    } else {
      setJoinMessage(result.message);
    }
  };

  const isOrgRequestPending = (orgId: number) => {
    return joinRequests.some(req => req.orgId === orgId && req.status === 'pending');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-[var(--background-secondary)] border border-[var(--accent-border)] rounded-lg max-w-2xl w-full max-h-[80vh] overflow-hidden">
        <div className="card-header border-b border-[var(--accent-border)]">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-[var(--foreground)]">
              Join an Organization
            </h2>
            <button
              onClick={onClose}
              className="text-[var(--foreground-secondary)] hover:text-[var(--foreground-light)] text-xl"
            >
              ✕
            </button>
          </div>
          <p className="text-sm text-[var(--foreground-secondary)] mt-2">
            Browse and request to join public organizations
          </p>
        </div>

        <div className="main-content overflow-y-auto max-h-[60vh]">
          {joinMessage && (
            <div className={`mb-4 p-4 rounded-lg ${
              joinMessage.includes('sent')
                ? 'bg-[var(--success-light)] border border-[var(--success)] text-[var(--success)]'
                : 'bg-[var(--error-light)] border border-[var(--error)] text-[var(--error)]'
            }`}>
              <div className="flex items-center space-x-2">
                <span>{joinMessage.includes('sent') ? '✅' : '⚠️'}</span>
                <p>{joinMessage}</p>
              </div>
            </div>
          )}

          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-[var(--background)] rounded-lg h-32 animate-pulse" />
              ))}
            </div>
          ) : error ? (
            <div className="bg-[var(--error-light)] border border-[var(--error)] rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <span className="text-[var(--error)]">⚠️</span>
                <p className="text-[var(--error)]">{error}</p>
              </div>
              <button
                onClick={loadOrganizations}
                className="mt-2 text-sm text-[var(--accent-primary)] hover:text-[var(--accent-primary-light)] underline"
              >
                Try again
              </button>
            </div>
          ) : organizations.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-4">🏢</div>
              <h3 className="text-lg font-medium text-[var(--foreground)] mb-2">
                No public organizations available
              </h3>
              <p className="text-[var(--foreground-secondary)]">
                Check back later for new organizations to join.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {organizations.map((org) => {
                const isPending = isOrgRequestPending(org.id);
                const isCurrentlyJoining = isJoining && selectedOrg?.id === org.id;

                return (
                  <div
                    key={org.id}
                    className="border border-[var(--accent-border)] rounded-lg p-4 hover:border-[var(--foreground-light)] transition-colors card-header"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <div className="text-xl">
                            {org.type === 'community' ? '👥' :
                             org.type === 'university' ? '🎓' :
                             org.type === 'startup' ? '🚀' : '🏢'}
                          </div>
                          <div>
                            <h3 className="font-medium text-[var(--foreground)]">
                              {org.name}
                            </h3>
                            <p className="text-xs text-[var(--foreground-secondary)] capitalize">
                              {org.type} Organization
                            </p>
                          </div>
                        </div>

                        <p className="text-sm text-[var(--foreground-light)] mb-3 line-clamp-2">
                          {org.description}
                        </p>

                        <div className="flex items-center space-x-4 text-xs text-[var(--foreground-secondary)]">
                          <span>👥 {org.memberCount} members</span>
                          <span>📅 {org.eventsCount} events</span>
                          <span>🌐 Public</span>
                        </div>
                      </div>

                      <div className="ml-4">
                        {isPending ? (
                          <button
                            disabled
                            className="bg-[var(--warning-light)] text-[var(--warning)] border border-[var(--warning)] px-4 py-2 rounded-lg text-sm font-medium cursor-not-allowed"
                          >
                            ⏳ Pending
                          </button>
                        ) : (
                          <button
                            onClick={() => handleJoinRequest(org)}
                            disabled={isCurrentlyJoining}
                            className="btn btn-primary"
                            style={{
                              padding: '0.75rem 1rem',
                              fontSize: '0.875rem',
                              opacity: isCurrentlyJoining ? 0.6 : 1
                            }}
                          >
                            {isCurrentlyJoining ? '⏳ Requesting...' : 'Request to Join'}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="card-header" style={{ borderTop: '1px solid var(--accent-border)' }}>
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="btn btn-secondary"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}