'use client';

import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Header } from '@/components/layout/Header';
import { ApprovalQueue } from '@/components/approval/ApprovalQueue';
import { useStore } from '@/store';

export default function ApprovalsPage() {
  const { currentUser, customizedAssets } = useStore();
  const pendingCount = customizedAssets.filter(
    (a) => a.status === 'pending_approval'
  ).length;

  // Redirect non-admin/brand-manager users
  if (currentUser?.role !== 'admin' && currentUser?.role !== 'brand_manager') {
    return (
      <MainLayout>
        <Header title="Approvals" subtitle="Review pending assets" />
        <div className="p-6">
          <div className="card p-12 text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Access Restricted
            </h3>
            <p className="text-gray-500">
              Only brand managers and admins can access the approval queue.
            </p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Header
        title="Approval Queue"
        subtitle={`${pendingCount || 3} asset${pendingCount !== 1 ? 's' : ''} pending review`}
      />

      <div className="p-6">
        <ApprovalQueue />
      </div>
    </MainLayout>
  );
}
