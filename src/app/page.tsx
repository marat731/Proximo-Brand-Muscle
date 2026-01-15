'use client';

import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Header } from '@/components/layout/Header';
import { DashboardStats } from '@/components/dashboard/DashboardStats';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { RecentActivity } from '@/components/dashboard/RecentActivity';
import { BrandOverview } from '@/components/dashboard/BrandOverview';
import { useStore } from '@/store';

export default function DashboardPage() {
  const { currentUser } = useStore();

  return (
    <MainLayout>
      <Header
        title={`Welcome back, ${currentUser?.name.split(' ')[0]}`}
        subtitle="Here's what's happening with your brand assets"
      />

      <div className="p-6 space-y-6">
        {/* Stats */}
        <DashboardStats />

        {/* Quick Actions */}
        <QuickActions />

        {/* Two column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activity - Takes 2 columns */}
          <div className="lg:col-span-2">
            <RecentActivity />
          </div>

          {/* Brand Overview - Takes 1 column */}
          <div className="lg:col-span-1">
            <BrandOverview />
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
