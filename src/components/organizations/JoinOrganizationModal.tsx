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
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              Join an Organization
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-xl"
            >
              ✕
            </button>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Browse and request to join public organizations
          </p>
        </div>

        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {joinMessage && (
            <div className={`mb-4 p-4 rounded-lg ${
              joinMessage.includes('sent')
                ? 'bg-green-50 border border-green-200 text-green-700'
                : 'bg-red-50 border border-red-200 text-red-700'
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
                <div key={i} className="bg-gray-100 rounded-lg h-32 animate-pulse" />
              ))}
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <span className="text-red-500">⚠️</span>
                <p className="text-red-700">{error}</p>
              </div>
              <button
                onClick={loadOrganizations}
                className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
              >
                Try again
              </button>
            </div>
          ) : organizations.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-4">🏢</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No public organizations available
              </h3>
              <p className="text-gray-500">
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
                    className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
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
                            <h3 className="font-medium text-gray-900">
                              {org.name}
                            </h3>
                            <p className="text-xs text-gray-500 capitalize">
                              {org.type} Organization
                            </p>
                          </div>
                        </div>

                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                          {org.description}
                        </p>

                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span>👥 {org.memberCount} members</span>
                          <span>📅 {org.eventsCount} events</span>
                          <span>🌐 Public</span>
                        </div>
                      </div>

                      <div className="ml-4">
                        {isPending ? (
                          <button
                            disabled
                            className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-lg text-sm font-medium cursor-not-allowed"
                          >
                            ⏳ Pending
                          </button>
                        ) : (
                          <button
                            onClick={() => handleJoinRequest(org)}
                            disabled={isCurrentlyJoining}
                            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
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

          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <div className="flex items-start space-x-2">
                <span className="text-yellow-500">💡</span>
                <div className="text-xs text-yellow-700">
                  <p className="font-medium">Demo Mode:</p>
                  <p>Join requests are simulated. In the real platform, organization admins will review and approve your requests.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}