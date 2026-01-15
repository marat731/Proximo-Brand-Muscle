'use client';

import React from 'react';
import { Sidebar } from './Sidebar';
import { useStore } from '@/store';
import clsx from 'clsx';

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const { sidebarOpen } = useStore();

  return (
    <div className="min-h-screen bg-proximo-cream">
      <Sidebar />
      <main
        className={clsx(
          'transition-all duration-300',
          sidebarOpen ? 'ml-64' : 'ml-20'
        )}
      >
        {children}
      </main>
    </div>
  );
}
