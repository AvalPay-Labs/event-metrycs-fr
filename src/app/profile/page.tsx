'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth-store';
import { useWalletStore } from '@/store/wallet-store';
import MainLayout from '@/components/layout/MainLayout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { WalletButton, WalletStatus } from '@/components/wallet';

export default function ProfilePage() {
  const router = useRouter();
  const { isAuthenticated, user, initializeAuth } = useAuthStore();
  const { initializeWallet, isConnected } = useWalletStore();

  useEffect(() => {
    initializeAuth();
    initializeWallet();
  }, [initializeAuth, initializeWallet]);

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
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  const handleBackToDashboard = () => {
    router.push('/dashboard');
  };

  return (
    <MainLayout
      title="User Profile"
      subtitle="Manage your profile and wallet settings"
      updatedAt="Live"
      userAvatars={[user.firstName.charAt(0) + user.lastName.charAt(0)]}
      onShare={() => {}}
    >
      <div style={{ maxWidth: '800px' }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <Button variant="ghost" size="sm" onClick={handleBackToDashboard}>
            ← Back to Dashboard
          </Button>
        </div>

        {/* Personal Information Card */}
        <Card title="Personal Information" style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
            <div>
              <div style={{ marginBottom: '1rem' }}>
                <dt style={{ fontSize: '0.75rem', fontWeight: '500', color: 'var(--foreground-secondary)', marginBottom: '0.25rem' }}>
                  Full Name
                </dt>
                <dd style={{ fontSize: '0.875rem', color: 'var(--foreground)' }}>
                  {user.firstName} {user.lastName}
                </dd>
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <dt style={{ fontSize: '0.75rem', fontWeight: '500', color: 'var(--foreground-secondary)', marginBottom: '0.25rem' }}>
                  Email Address
                </dt>
                <dd style={{ fontSize: '0.875rem', color: 'var(--foreground)' }}>
                  {user.email}
                </dd>
              </div>
              <div>
                <dt style={{ fontSize: '0.75rem', fontWeight: '500', color: 'var(--foreground-secondary)', marginBottom: '0.25rem' }}>
                  Account Created
                </dt>
                <dd style={{ fontSize: '0.875rem', color: 'var(--foreground)' }}>
                  {new Date(user.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </dd>
              </div>
            </div>

            <div>
              <div style={{ marginBottom: '1rem' }}>
                <dt style={{ fontSize: '0.75rem', fontWeight: '500', color: 'var(--foreground-secondary)', marginBottom: '0.25rem' }}>
                  Authentication Provider
                </dt>
                <dd style={{ fontSize: '0.875rem', color: 'var(--foreground)', textTransform: 'capitalize' }}>
                  {user.provider}
                </dd>
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <dt style={{ fontSize: '0.75rem', fontWeight: '500', color: 'var(--foreground-secondary)', marginBottom: '0.25rem' }}>
                  Email Verification Status
                </dt>
                <dd style={{ fontSize: '0.875rem', color: 'var(--foreground)' }}>
                  <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    padding: '0.25rem 0.5rem',
                    borderRadius: '9999px',
                    fontSize: '0.75rem',
                    fontWeight: '500',
                    background: user.emailVerified ? '#dcfce7' : '#fef2f2',
                    color: user.emailVerified ? '#166534' : '#dc2626'
                  }}>
                    {user.emailVerified ? 'Verified' : 'Pending'}
                  </span>
                </dd>
              </div>
            </div>
          </div>
        </Card>

        {/* Wallet Connection Card */}
        <Card title="Wallet Connection" style={{ marginBottom: '1.5rem' }}>
          <div style={{ marginBottom: '1rem' }}>
            <p style={{
              fontSize: '0.875rem',
              color: 'var(--foreground-light)',
              marginBottom: '1rem',
              lineHeight: '1.5'
            }}>
              Connect your wallet to participate in blockchain events and track on-chain metrics.
            </p>

            {!isConnected ? (
              <div style={{
                border: '2px dashed var(--border)',
                borderRadius: 'var(--radius-md)',
                padding: '2rem',
                textAlign: 'center',
                backgroundColor: 'var(--accent-light-gray)'
              }}>
                <div style={{ marginBottom: '1rem' }}>
                  <span style={{ fontSize: '2rem' }}>🔷</span>
                </div>
                <h3 style={{
                  fontSize: '1rem',
                  fontWeight: '600',
                  color: 'var(--foreground)',
                  marginBottom: '0.5rem'
                }}>
                  No Wallet Connected
                </h3>
                <p style={{
                  fontSize: '0.875rem',
                  color: 'var(--foreground-light)',
                  marginBottom: '1.5rem'
                }}>
                  Connect a wallet to get started with blockchain features
                </p>
                <WalletButton />
              </div>
            ) : (
              <WalletStatus showFullAddress={true} showConnectionTime={true} />
            )}
          </div>

          {isConnected && (
            <div style={{
              borderTop: '1px solid var(--border)',
              paddingTop: '1rem',
              marginTop: '1rem'
            }}>
              <h4 style={{
                fontSize: '0.875rem',
                fontWeight: '600',
                color: 'var(--foreground)',
                marginBottom: '0.5rem'
              }}>
                Wallet Actions
              </h4>
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <WalletButton />
                <Button variant="ghost" size="sm">
                  View Transaction History
                </Button>
              </div>
            </div>
          )}
        </Card>

        {/* Account Settings Card */}
        <Card title="Account Settings">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '0.75rem',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)'
            }}>
              <div>
                <h4 style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--foreground)', marginBottom: '0.25rem' }}>
                  Change Password
                </h4>
                <p style={{ fontSize: '0.75rem', color: 'var(--foreground-light)' }}>
                  Update your account password
                </p>
              </div>
              <Button variant="ghost" size="sm">
                Change
              </Button>
            </div>

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '0.75rem',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)'
            }}>
              <div>
                <h4 style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--foreground)', marginBottom: '0.25rem' }}>
                  Download Data
                </h4>
                <p style={{ fontSize: '0.75rem', color: 'var(--foreground-light)' }}>
                  Export your profile and event data
                </p>
              </div>
              <Button variant="ghost" size="sm">
                Download
              </Button>
            </div>

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '0.75rem',
              border: '1px solid var(--accent-red-light)',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--accent-red-light)'
            }}>
              <div>
                <h4 style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--accent-red)', marginBottom: '0.25rem' }}>
                  Delete Account
                </h4>
                <p style={{ fontSize: '0.75rem', color: 'var(--accent-red)' }}>
                  Permanently delete your account and all data
                </p>
              </div>
              <Button variant="ghost" size="sm" style={{ color: 'var(--accent-red)' }}>
                Delete
              </Button>
            </div>
          </div>
        </Card>

        {/* Demo Notice */}
        <div style={{
          background: '#fef3c7',
          border: '1px solid #f59e0b',
          borderRadius: 'var(--radius-md)',
          padding: '1rem',
          marginTop: '1.5rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start' }}>
            <div style={{ marginRight: '0.75rem', flexShrink: 0 }}>
              <svg width="20" height="20" fill="#f59e0b" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h3 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#92400e', marginBottom: '0.5rem' }}>
                Demo Implementation
              </h3>
              <p style={{ fontSize: '0.875rem', color: '#92400e', margin: 0, lineHeight: '1.5' }}>
                This profile page uses <strong>simulated data</strong> as per the brownfield PRD.
                All wallet connections are mock implementations for demonstration purposes.
              </p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}