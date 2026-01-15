'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { MainLayout } from '@/components/layout/MainLayout';
import { Header } from '@/components/layout/Header';
import { useStore } from '@/store';
import {
  FileImage,
  Clock,
  CheckCircle,
  XCircle,
  Send,
  Download,
  MoreVertical,
  Trash2,
  Copy,
  ExternalLink,
  ChevronDown,
} from 'lucide-react';
import clsx from 'clsx';
import { format } from 'date-fns';

type StatusFilter = 'all' | 'draft' | 'pending_approval' | 'approved' | 'rejected';

const statusConfig = {
  draft: { label: 'Draft', icon: FileImage, color: 'badge-info' },
  pending_approval: { label: 'Pending', icon: Clock, color: 'badge-warning' },
  approved: { label: 'Approved', icon: CheckCircle, color: 'badge-success' },
  rejected: { label: 'Rejected', icon: XCircle, color: 'badge-error' },
  exported: { label: 'Exported', icon: Download, color: 'badge-gold' },
};

export default function MyAssetsPage() {
  const { customizedAssets, templates, brands, currentUser } = useStore();
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter assets created by current user
  const userAssets = useMemo(() => {
    return customizedAssets.filter((asset) => {
      // Filter by creator
      if (asset.createdBy !== currentUser?.name) return false;

      // Filter by status
      if (statusFilter !== 'all' && asset.status !== statusFilter) return false;

      // Filter by search
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const template = templates.find((t) => t.id === asset.templateId);
        return (
          asset.name.toLowerCase().includes(query) ||
          template?.name.toLowerCase().includes(query)
        );
      }

      return true;
    });
  }, [customizedAssets, currentUser, statusFilter, searchQuery, templates]);

  // Sample assets for demo
  const demoAssets = [
    {
      id: 'demo-1',
      templateId: 'tpl-jc-shelf-1',
      name: 'Jose Cuervo - Walmart Southwest',
      status: 'approved' as const,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
      updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    },
    {
      id: 'demo-2',
      templateId: 'tpl-kraken-endcap-1',
      name: 'Kraken End Cap - Total Wine',
      status: 'pending_approval' as const,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
      updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
    },
    {
      id: 'demo-3',
      templateId: 'tpl-1800-shelf-1',
      name: '1800 Tequila - BevMo Display',
      status: 'draft' as const,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
      updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    },
  ];

  const displayAssets = userAssets.length > 0 ? userAssets : demoAssets;

  return (
    <MainLayout>
      <Header
        title="My Assets"
        subtitle="Manage your customized brand assets"
        showSearch
        onSearch={setSearchQuery}
        actions={
          <Link href="/templates" className="btn-primary">
            Create New
          </Link>
        }
      />

      <div className="p-6">
        {/* Filters */}
        <div className="flex items-center gap-4 mb-6">
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
              className="select-field pr-8 appearance-none min-w-[160px]"
            >
              <option value="all">All Status</option>
              <option value="draft">Draft</option>
              <option value="pending_approval">Pending Approval</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>

          <p className="text-sm text-gray-500 ml-auto">
            {displayAssets.length} asset{displayAssets.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Assets Grid */}
        {displayAssets.length === 0 ? (
          <div className="card p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileImage className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No assets yet</h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              Start customizing templates to create brand assets for your market.
            </p>
            <Link href="/templates" className="btn-primary">
              Browse Templates
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayAssets.map((asset) => {
              const template = templates.find((t) => t.id === asset.templateId);
              const brand = brands.find((b) => b.id === template?.brandId);
              const status = statusConfig[asset.status];
              const StatusIcon = status.icon;

              return (
                <div key={asset.id} className="card group">
                  {/* Thumbnail */}
                  <div
                    className="relative aspect-[4/3]"
                    style={{ backgroundColor: brand?.colors.background || '#f5f5f5' }}
                  >
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div
                        className="w-24 h-24 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: brand?.colors.primary || '#C5A572' }}
                      >
                        <FileImage className="w-10 h-10 text-white/80" />
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div className="absolute top-3 right-3">
                      <span className={clsx('flex items-center gap-1', status.color)}>
                        <StatusIcon className="w-3 h-3" />
                        {status.label}
                      </span>
                    </div>

                    {/* Hover Actions */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                      <Link
                        href={`/editor/${asset.templateId}?asset=${asset.id}`}
                        className="px-4 py-2 bg-white rounded-lg text-sm font-medium text-gray-900 hover:bg-gray-100 transition-colors"
                      >
                        Edit
                      </Link>
                      {asset.status === 'approved' && (
                        <button className="px-4 py-2 bg-proximo-gold rounded-lg text-sm font-medium text-white hover:bg-opacity-90 transition-colors">
                          Export
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <h3 className="font-medium text-gray-900 line-clamp-1">
                      {asset.name}
                    </h3>
                    <p className="text-sm text-gray-500 mt-0.5">
                      {template?.name}
                    </p>

                    <div className="flex items-center justify-between mt-4 text-xs text-gray-400">
                      <span>Updated {format(new Date(asset.updatedAt), 'MMM d')}</span>
                      <button className="p-1 hover:bg-gray-100 rounded transition-colors">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
