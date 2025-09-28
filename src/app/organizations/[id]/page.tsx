'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth-store';
import OrganizationDetail from '@/components/organizations/OrganizationDetail';
import MainLayout from '@/components/layout/MainLayout';

interface OrganizationDetailPageProps {
  params: {
    id: string;
  };
}

export default function OrganizationDetailPage({ params }: OrganizationDetailPageProps) {
  const router = useRouter();
  const { isAuthenticated, user, initializeAuth } = useAuthStore();
  const organizationId = parseInt(params.id);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  useEffect(() => {
    if (!isAuthenticated && user === null) {
      router.push('/auth');
    }
  }, [isAuthenticated, user, router]);

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading organization...</p>
        </div>
      </div>
    );
  }

  if (isNaN(organizationId)) {
    return (
      <MainLayout
        title="Invalid Organization"
        subtitle="Organization not found"
        updatedAt="now"
        userAvatars={['EM']}
      >
        <div className="text-center py-12">
          <div className="text-4xl mb-4">❌</div>
          <h3 className="text-lg font-medium text-white mb-2">
            Invalid Organization ID
          </h3>
          <p className="text-gray-400 mb-4">
            The organization ID provided is not valid.
          </p>
          <button
            onClick={() => router.push('/organizations')}
            className="btn btn-primary"
            style={{
              padding: '0.75rem 1.5rem',
              fontSize: '0.875rem'
            }}
          >
            Back to Organizations
          </button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout
      title="Organization Details"
      subtitle="View organization information and members"
      updatedAt="now"
      userAvatars={['EM', user.firstName.charAt(0), user.lastName.charAt(0)]}
      onShare={() => {
        navigator.clipboard.writeText(window.location.href);
        alert('Organization URL copied to clipboard!');
      }}
    >
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <button
            onClick={() => router.push('/organizations')}
            className="flex items-center text-orange-400 hover:text-orange-300 font-medium"
          >
            ← Back to Organizations
          </button>
        </div>

        <OrganizationDetail organizationId={organizationId} />
      </div>
    </MainLayout>
  );
}