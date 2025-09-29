'use client';

import { ThemeToggle } from '@/components/ui/ThemeToggle';

interface HeaderProps {
  title: string;
  subtitle?: string;
  updatedAt?: string;
  userAvatars?: string[];
  onShare?: () => void;
}

export default function Header({
  title,
  subtitle,
  updatedAt,
  userAvatars = [],
  onShare
}: HeaderProps) {
  return (
    <header className="header">
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div>
          <h1 className="header-title">{title}</h1>
          {subtitle && (
            <p className="text-secondary" style={{
              fontSize: '0.875rem',
              margin: '0.25rem 0 0 0'
            }}>
              {subtitle}
            </p>
          )}
        </div>
      </div>

      <div className="header-actions">
        {updatedAt && (
          <span className="text-secondary" style={{
            fontSize: '0.875rem'
          }}>
            Updated {updatedAt}
          </span>
        )}

        {userAvatars.length > 0 && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem'
          }}>
            {userAvatars.slice(0, 3).map((avatar, index) => (
              <div
                key={index}
                style={{
                  width: '2rem',
                  height: '2rem',
                  borderRadius: '50%',
                  background: avatar === 'EM' ? 'var(--accent-blue)' : 'var(--success)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  border: '2px solid var(--background)',
                  marginLeft: index > 0 ? '-0.5rem' : '0',
                  zIndex: userAvatars.length - index,
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                {avatar}
              </div>
            ))}
            {userAvatars.length > 3 && (
              <span className="text-secondary" style={{
                fontSize: '0.75rem',
                marginLeft: '0.5rem'
              }}>
                +{userAvatars.length - 3}
              </span>
            )}
          </div>
        )}

        {/* <ThemeToggle /> */}

        {onShare && (
          <button
            onClick={onShare}
            className="btn btn-primary"
            style={{
              padding: '0.75rem 1rem',
              fontSize: '0.875rem'
            }}
          >
            Share
          </button>
        )}
      </div>
    </header>
  );
}
