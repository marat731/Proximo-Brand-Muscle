'use client';

import React from 'react';
import { useStore } from '@/store';
import {
  FileImage,
  CheckCircle,
  Clock,
  Download,
  TrendingUp,
  ArrowUpRight,
} from 'lucide-react';
import clsx from 'clsx';

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  trend?: {
    value: number;
    positive: boolean;
  };
  color: string;
}

function StatCard({ icon, label, value, trend, color }: StatCardProps) {
  return (
    <div className="card p-6">
      <div className="flex items-start justify-between">
        <div
          className={clsx(
            'w-12 h-12 rounded-xl flex items-center justify-center',
            color
          )}
        >
          {icon}
        </div>
        {trend && (
          <div
            className={clsx(
              'flex items-center gap-1 text-sm font-medium',
              trend.positive ? 'text-green-600' : 'text-red-600'
            )}
          >
            <TrendingUp
              className={clsx('w-4 h-4', !trend.positive && 'rotate-180')}
            />
            {trend.value}%
          </div>
        )}
      </div>
      <div className="mt-4">
        <p className="text-3xl font-bold text-gray-900">{value}</p>
        <p className="text-sm text-gray-500 mt-1">{label}</p>
      </div>
    </div>
  );
}

export function DashboardStats() {
  const { customizedAssets, templates } = useStore();

  const stats = {
    totalAssets: customizedAssets.length || 24,
    approved: customizedAssets.filter((a) => a.status === 'approved').length || 18,
    pending: customizedAssets.filter((a) => a.status === 'pending_approval').length || 3,
    exported: customizedAssets.filter((a) => a.exportHistory.length > 0).length || 45,
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard
        icon={<FileImage className="w-6 h-6 text-white" />}
        label="Total Assets Created"
        value={stats.totalAssets}
        trend={{ value: 12, positive: true }}
        color="bg-proximo-gold"
      />
      <StatCard
        icon={<CheckCircle className="w-6 h-6 text-white" />}
        label="Approved Assets"
        value={stats.approved}
        trend={{ value: 8, positive: true }}
        color="bg-green-500"
      />
      <StatCard
        icon={<Clock className="w-6 h-6 text-white" />}
        label="Pending Review"
        value={stats.pending}
        color="bg-yellow-500"
      />
      <StatCard
        icon={<Download className="w-6 h-6 text-white" />}
        label="Total Exports"
        value={stats.exported}
        trend={{ value: 23, positive: true }}
        color="bg-proximo-blue"
      />
    </div>
  );
}
