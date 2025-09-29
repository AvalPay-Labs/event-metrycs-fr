'use client';

import { ReactNode } from 'react';

interface TimelineItem {
  id: string;
  content: string;
  timestamp: string;
  icon?: ReactNode;
}

interface TimelineProps {
  items: TimelineItem[];
  title?: string;
}

export default function Timeline({ items, title }: TimelineProps) {
  return (
    <div>
      {title && (
        <h2 style={{ 
          fontSize: '1.125rem', 
          fontWeight: '600', 
          color: 'var(--foreground)',
          marginBottom: '1.5rem'
        }}>
          {title}
        </h2>
      )}
      
      <div style={{ position: 'relative' }}>
        {/* Timeline line */}
        <div style={{
          position: 'absolute',
          left: '0.75rem',
          top: '0',
          bottom: '0',
          width: '2px',
          background: 'var(--accent-border)'
        }} />
        
        {items.map((item) => (
          <div key={item.id} style={{ 
            position: 'relative', 
            paddingLeft: '3rem', 
            marginBottom: '1.5rem' 
          }}>
            {/* Timeline dot */}
            <div style={{
              position: 'absolute',
              left: '0.5rem',
              top: '0.25rem',
              width: '0.5rem',
              height: '0.5rem',
              borderRadius: '50%',
              background: 'var(--accent-blue)',
              border: '2px solid white',
              boxShadow: '0 0 0 2px var(--accent-border)'
            }} />
            
            {/* Content */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'flex-start',
              gap: '1rem'
            }}>
              <div style={{ flex: 1 }}>
                <p style={{ 
                  color: 'var(--foreground)', 
                  margin: '0 0 0.25rem 0',
                  lineHeight: '1.5'
                }}>
                  {item.content}
                </p>
                {item.icon && (
                  <div style={{ marginTop: '0.5rem' }}>
                    {item.icon}
                  </div>
                )}
              </div>
              <span style={{ 
                fontSize: '0.75rem', 
                color: 'var(--foreground-secondary)',
                whiteSpace: 'nowrap'
              }}>
                {item.timestamp}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
