'use client';

import { useEffect } from 'react';
import { useUserOrganizations } from '@/store/organization-store';
import { useAuthStore } from '@/store/auth-store';
import OrganizationCard from './OrganizationCard';
import JoinOrganizationModal from './JoinOrganizationModal';
import { useState } from 'react';

export default function OrganizationList() {
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
          <h2 className="text-xl font-semibold text-white">My Organizations</h2>
          <div className="text-sm text-gray-400">Loading...</div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-gray-800 rounded-lg h-48 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-white">My Organizations</h2>
        <div className="bg-red-900/20 border border-red-800 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <span className="text-red-400">⚠️</span>
            <p className="text-red-300">{error}</p>
          </div>
          <button
            onClick={() => user?.id && loadOrganizations(Number(user.id))}
            className="mt-2 text-sm text-red-400 hover:text-red-300 underline"
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
          <h2 className="text-xl font-semibold text-white">My Organizations</h2>
          <p className="text-sm text-gray-400 mt-1">
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
        <div className="text-center py-12 bg-gray-800 rounded-lg border border-gray-700">
          <div className="text-4xl mb-4">🏢</div>
          <h3 className="text-lg font-medium text-white mb-2">
            No organizations yet
          </h3>
          <p className="text-gray-400 mb-4">
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
                window.location.href = `/organizations/${org.id}`;
              }}
            />
          ))}
        </div>
      )}

      <div className="bg-orange-900/20 border border-orange-800 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <span className="text-orange-400 text-lg">ℹ️</span>
          <div>
            <h4 className="font-medium text-orange-400">Demo Mode Active</h4>
            <p className="text-sm text-orange-300 mt-1">
              You&apos;re viewing simulated organization data. In the full platform,
              you&apos;ll see real organizations and be able to manage actual events and metrics.
            </p>
          </div>
        </div>
      </div>

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