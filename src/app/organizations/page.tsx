'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth-store';
import { OrganizationList } from '@/components/organizations';
import MainLayout from '@/components/layout/MainLayout';

export default function OrganizationsPage() {
  const router = useRouter();
  const { isAuthenticated, user, initializeAuth } = useAuthStore();

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
          <p className="text-gray-600">Loading organizations...</p>
        </div>
      </div>
    );
  }

  return (
    <MainLayout
      title="Organizations"
      subtitle="Manage your organization memberships"
      updatedAt="now"
      userAvatars={['EM', user.firstName.charAt(0), user.lastName.charAt(0)]}
    >
      <div className="max-w-6xl mx-auto">
        <OrganizationList />
      </div>
    </MainLayout>
  );
}