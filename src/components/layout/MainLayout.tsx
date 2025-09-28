'use client';

import { ReactNode } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

interface MainLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
  updatedAt?: string;
  userAvatars?: string[];
  onShare?: () => void;
}

export default function MainLayout({
  children,
  title,
  subtitle,
  updatedAt,
  userAvatars,
  onShare
}: MainLayoutProps) {
  return (
    <div className="main-layout">
      <Sidebar />
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Header
          title={title}
          subtitle={subtitle}
          updatedAt={updatedAt}
          userAvatars={userAvatars}
          onShare={onShare}
        />
        <main className="main-content">
          {children}
        </main>
      </div>
    </div>
  );
}
