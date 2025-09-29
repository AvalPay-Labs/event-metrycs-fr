'use client';

// Event Metrycs landing page
// Redirects users to appropriate page based on authentication status

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth-store';
import Link from 'next/link';

export default function Home() {
  const router = useRouter();
  const { isAuthenticated, initializeAuth } = useAuthStore();

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  useEffect(() => {
    // Auto-redirect authenticated users to dashboard
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  return (
    <div className="min-h-screen" style={{ background: 'var(--background)' }}>
      {/* Header */}
      <header className="header">
        <div className="flex items-center justify-between w-full max-w-7xl mx-auto px-6">
          <div className="flex items-center">
            <h1 className="header-title">Event Metrycs</h1>
          </div>
          <div className="header-actions">
            <Link href="/auth" className="btn btn-primary">
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center">
            <h1 style={{ 
              fontSize: '3rem', 
              fontWeight: '700', 
              lineHeight: '1.1',
              color: 'var(--foreground)',
              marginBottom: '1.5rem'
            }}>
              <span style={{ display: 'block' }}>Blockchain event</span>
              <span style={{ display: 'block', color: 'var(--accent-blue)' }}>metrics simplified</span>
            </h1>
            <p style={{ 
              fontSize: '1.25rem',
              color: 'var(--foreground-light)',
              maxWidth: '48rem',
              margin: '0 auto 2rem',
              lineHeight: '1.6'
            }}>
              Comprehensive platform to measure, track and analyze both on-chain and off-chain event metrics
              for organizations hosting blockchain-focused events.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/auth" className="btn btn-primary" style={{ padding: '0.75rem 2rem', fontSize: '1rem' }}>
                Sign Up Free
              </Link>
              <Link href="/auth" className="btn btn-secondary" style={{ padding: '0.75rem 2rem', fontSize: '1rem' }}>
                Sign In
              </Link>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="py-16" style={{ background: 'var(--background-secondary)', marginTop: '4rem' }}>
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-12">
              <h2 style={{ 
                fontSize: '0.875rem',
                color: 'var(--accent-blue)',
                fontWeight: '600',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginBottom: '0.5rem'
              }}>
                Features
              </h2>
              <h3 style={{ 
                fontSize: '2.25rem',
                fontWeight: '700',
                color: 'var(--foreground)',
                lineHeight: '1.2'
              }}>
                Everything you need to measure impact
              </h3>
            </div>

            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
              gap: '2rem' 
            }}>
              <div className="card">
                <div className="card-body">
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    marginBottom: '1rem' 
                  }}>
                    <div style={{
                      width: '3rem',
                      height: '3rem',
                      background: 'var(--accent-blue)',
                      borderRadius: 'var(--radius-md)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: '1rem'
                    }}>
                      <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="white">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <h4 style={{ fontSize: '1.125rem', fontWeight: '600', color: 'var(--foreground)' }}>
                      On-Chain Metrics
                    </h4>
                  </div>
                  <p style={{ color: 'var(--foreground-light)', lineHeight: '1.6' }}>
                    Track blockchain activities: airdrops, wallet creation, transaction volume and reactivation.
                  </p>
                </div>
              </div>

              <div className="card">
                <div className="card-body">
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    marginBottom: '1rem' 
                  }}>
                    <div style={{
                      width: '3rem',
                      height: '3rem',
                      background: 'var(--accent-blue)',
                      borderRadius: 'var(--radius-md)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: '1rem'
                    }}>
                      <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="white">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <h4 style={{ fontSize: '1.125rem', fontWeight: '600', color: 'var(--foreground)' }}>
                      Event Management
                    </h4>
                  </div>
                  <p style={{ color: 'var(--foreground-light)', lineHeight: '1.6' }}>
                    Complete event management lifecycle from creation to post-mortem with approval workflows.
                  </p>
                </div>
              </div>

              <div className="card">
                <div className="card-body">
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    marginBottom: '1rem' 
                  }}>
                    <div style={{
                      width: '3rem',
                      height: '3rem',
                      background: 'var(--accent-blue)',
                      borderRadius: 'var(--radius-md)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: '1rem'
                    }}>
                      <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="white">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                      </svg>
                    </div>
                    <h4 style={{ fontSize: '1.125rem', fontWeight: '600', color: 'var(--foreground)' }}>
                      Roles & Organizations
                    </h4>
                  </div>
                  <p style={{ color: 'var(--foreground-light)', lineHeight: '1.6' }}>
                    Role-based permissions system with multi-organization management and data isolation.
                  </p>
                </div>
              </div>

              <div className="card">
                <div className="card-body">
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    marginBottom: '1rem' 
                  }}>
                    <div style={{
                      width: '3rem',
                      height: '3rem',
                      background: 'var(--accent-blue)',
                      borderRadius: 'var(--radius-md)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: '1rem'
                    }}>
                      <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="white">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h4 style={{ fontSize: '1.125rem', fontWeight: '600', color: 'var(--foreground)' }}>
                      Audit Trail
                    </h4>
                  </div>
                  <p style={{ color: 'var(--foreground-light)', lineHeight: '1.6' }}>
                    Immutable record of all actions with timestamps and complete traceability for compliance.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer style={{
        background: 'var(--background-secondary)',
        borderTop: '1px solid var(--accent-border)',
        padding: '2rem 0'
      }}>
        <div className="max-w-7xl mx-auto px-6">
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            <p style={{ 
              fontSize: '0.875rem', 
              color: 'var(--foreground-light)', 
              margin: 0 
            }}>
              &copy; 2025 Event Metrycs. Blockchain metrics platform.
            </p>
            <p style={{ 
              fontSize: '0.875rem', 
              color: 'var(--foreground-light)', 
              margin: 0 
            }}>
              Event Metrycs - MVP with brownfield implementation
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
