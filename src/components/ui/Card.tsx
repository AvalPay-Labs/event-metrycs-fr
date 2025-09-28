'use client';

import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  title?: string;
  className?: string;
  style?: React.CSSProperties;
}

export default function Card({ children, title, className = '', style }: CardProps) {
  return (
    <div className={`card ${className}`} style={style}>
      {title && (
        <div className="card-header">
          <h3 style={{ 
            fontSize: '1.125rem', 
            fontWeight: '600', 
            color: 'var(--foreground)',
            margin: 0 
          }}>
            {title}
          </h3>
        </div>
      )}
      <div className="card-body">
        {children}
      </div>
    </div>
  );
}
