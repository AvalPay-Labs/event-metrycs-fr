'use client';

import { forwardRef, InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, className = '', style, ...props }, ref) => {
    return (
      <div style={{ marginBottom: '1rem' }}>
        {label && (
          <label style={{
            display: 'block',
            fontSize: '0.875rem',
            fontWeight: '500',
            color: 'var(--foreground)',
            marginBottom: '0.5rem'
          }}>
            {label}
          </label>
        )}
        
        <div style={{ position: 'relative' }}>
          {icon && (
            <div style={{
              position: 'absolute',
              left: '0.75rem',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--foreground-secondary)',
              zIndex: 1
            }}>
              {icon}
            </div>
          )}
          
          <input
            ref={ref}
            className={`input ${className}`}
            style={{
              paddingLeft: icon ? '2.5rem' : '0.75rem',
              ...style
            }}
            {...props}
          />
        </div>
        
        {error && (
          <p style={{
            fontSize: '0.75rem',
            color: 'var(--error)',
            margin: '0.25rem 0 0 0'
          }}>
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
