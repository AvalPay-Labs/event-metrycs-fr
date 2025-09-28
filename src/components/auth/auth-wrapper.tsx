'use client';

// Authentication wrapper component
// Handles switching between login and registration forms

import { useState } from 'react';
import RegisterForm from './register-form';
import LoginForm from './login-form';

interface AuthWrapperProps {
  onSuccess?: () => void;
  defaultMode?: 'login' | 'register';
}

export default function AuthWrapper({ onSuccess, defaultMode = 'register' }: AuthWrapperProps) {
  const [mode, setMode] = useState<'login' | 'register'>(defaultMode);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--background)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      padding: '3rem 1.5rem'
    }}>
      <div style={{
        margin: '0 auto',
        width: '100%',
        maxWidth: '28rem'
      }}>
        {/* Event Metrycs Logo/Brand */}
        <div style={{
          textAlign: 'center',
          marginBottom: '2rem'
        }}>
          <h1 style={{
            fontSize: '2.25rem',
            fontWeight: '700',
            color: 'var(--accent-blue)',
            marginBottom: '0.5rem',
            letterSpacing: '-0.025em'
          }}>
            Event Metrycs
          </h1>
          <p style={{
            color: 'var(--foreground-light)',
            fontSize: '1rem'
          }}>
            Blockchain event analytics platform
          </p>
        </div>

        {/* Tab Navigation */}
        <div style={{
          display: 'flex',
          gap: '0.25rem',
          background: 'var(--accent-gray)',
          padding: '0.25rem',
          borderRadius: 'var(--radius-lg)',
          marginBottom: '1.5rem'
        }}>
          <button
            onClick={() => setMode('register')}
            style={{
              flex: 1,
              padding: 'var(--spacing-md) var(--spacing-lg)',
              borderRadius: 'var(--radius-md)',
              border: 'none',
              background: mode === 'register' ? 'var(--background)' : 'transparent',
              color: mode === 'register' ? 'var(--foreground)' : 'var(--foreground-secondary)',
              fontWeight: '500',
              fontSize: '0.9375rem',
              cursor: 'pointer',
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: mode === 'register' ? 'var(--shadow-sm)' : 'none',
              minHeight: '44px'
            }}
          >
            Sign Up
          </button>
          <button
            onClick={() => setMode('login')}
            style={{
              flex: 1,
              padding: 'var(--spacing-md) var(--spacing-lg)',
              borderRadius: 'var(--radius-md)',
              border: 'none',
              background: mode === 'login' ? 'var(--background)' : 'transparent',
              color: mode === 'login' ? 'var(--foreground)' : 'var(--foreground-secondary)',
              fontWeight: '500',
              fontSize: '0.9375rem',
              cursor: 'pointer',
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: mode === 'login' ? 'var(--shadow-sm)' : 'none',
              minHeight: '44px'
            }}
          >
            Sign In
          </button>
        </div>

        {/* Form Content */}
        <div className="fade-in">
          {mode === 'register' ? (
            <RegisterForm
              onSuccess={onSuccess}
              onSwitchToLogin={() => setMode('login')}
            />
          ) : (
            <LoginForm
              onSuccess={onSuccess}
              onSwitchToRegister={() => setMode('register')}
            />
          )}
        </div>
      </div>
    </div>
  );
}