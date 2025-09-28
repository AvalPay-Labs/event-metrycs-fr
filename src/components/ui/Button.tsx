'use client';

import { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: ReactNode;
  children: ReactNode;
}

export default function Button({ 
  variant = 'primary', 
  size = 'md', 
  icon, 
  children, 
  className = '', 
  style,
  ...props 
}: ButtonProps) {
  const baseStyles: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    border: 'none',
    borderRadius: 'var(--radius-md)',
    fontWeight: '500',
    textDecoration: 'none',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    fontFamily: 'inherit'
  };

  const sizeStyles: Record<string, React.CSSProperties> = {
    sm: {
      padding: '0.375rem 0.75rem',
      fontSize: '0.75rem'
    },
    md: {
      padding: '0.5rem 1rem',
      fontSize: '0.875rem'
    },
    lg: {
      padding: '0.75rem 1.5rem',
      fontSize: '1rem'
    }
  };

  const variantStyles: Record<string, React.CSSProperties> = {
    primary: {
      background: 'var(--accent-blue)',
      color: 'white',
      boxShadow: 'var(--shadow-sm)'
    },
    secondary: {
      background: 'white',
      color: 'var(--accent-blue)',
      border: '1px solid var(--accent-border)'
    },
    ghost: {
      background: 'transparent',
      color: 'var(--foreground-light)',
      border: 'none'
    }
  };

  const hoverStyles: Record<string, React.CSSProperties> = {
    primary: {
      background: 'var(--accent-blue-hover)',
      boxShadow: 'var(--shadow-md)'
    },
    secondary: {
      background: 'var(--accent-light-gray)'
    },
    ghost: {
      background: 'var(--accent-light-gray)',
      color: 'var(--foreground)'
    }
  };

  return (
    <button
      className={`btn btn-${variant} ${className}`}
      style={{
        ...baseStyles,
        ...sizeStyles[size],
        ...variantStyles[variant],
        ...style
      }}
      onMouseEnter={(e) => {
        Object.assign(e.currentTarget.style, hoverStyles[variant]);
      }}
      onMouseLeave={(e) => {
        Object.assign(e.currentTarget.style, variantStyles[variant]);
      }}
      {...props}
    >
      {icon && <span>{icon}</span>}
      {children}
    </button>
  );
}
