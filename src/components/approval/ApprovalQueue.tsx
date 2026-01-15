'use client';

import React, { useState } from 'react';
import { useStore } from '@/store';
import { CustomizedAsset } from '@/types';
import {
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  MessageSquare,
  User,
  Calendar,
  Building,
  MapPin,
} from 'lucide-react';
import clsx from 'clsx';
import { format } from 'date-fns';

interface ApprovalItemProps {
  asset: CustomizedAsset;
  onApprove: (id: string) => void;
  onReject: (id: string, reason: string) => void;
  onPreview: (asset: CustomizedAsset) => void;
}

function ApprovalItem({ asset, onApprove, onReject, onPreview }: ApprovalItemProps) {
  const { templates, brands, markets, currentUser } = useStore();
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  const template = templates.find((t) => t.id === asset.templateId);
  const brand = brands.find((b) => b.id === template?.brandId);
  const market = markets.find((m) => m.id === asset.marketId);
  const retailer = market?.retailers.find((r) => r.id === asset.retailerId);

  const canApprove = currentUser?.role === 'admin' || currentUser?.role === 'brand_manager';

  const handleReject = () => {
    if (rejectReason.trim()) {
      onReject(asset.id, rejectReason);
      setShowRejectModal(false);
      setRejectReason('');
    }
  };

  return (
    <div className="card p-4">
      <div className="flex gap-4">
        {/* Preview thumbnail */}
        <div
          className="w-32 h-24 rounded-lg overflow-hidden flex-shrink-0"
          style={{ backgroundColor: brand?.colors.background || '#f5f5f5' }}
        >
          <div className="w-full h-full flex items-center justify-center">
            <div
              className="w-16 h-16 rounded flex items-center justify-center text-white/80"
              style={{ backgroundColor: brand?.colors.primary || '#C5A572' }}
            >
              <span className="text-xs font-medium">{template?.format}</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="font-medium text-gray-900">{asset.name}</h3>
              <p className="text-sm text-gray-500 mt-0.5">{template?.name}</p>
            </div>
            <span className="badge-warning flex items-center gap-1 flex-shrink-0">
              <Clock className="w-3 h-3" />
              Pending
            </span>
          </div>

          <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <User className="w-4 h-4" />
              <span>{asset.createdBy}</span>
            </div>
            {market && (
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span>{market.name}</span>
              </div>
            )}
            {retailer && (
              <div className="flex items-center gap-1">
                <Building className="w-4 h-4" />
                <span>{retailer.name}</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>{format(new Date(asset.createdAt), 'MMM d, yyyy')}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 mt-4">
            <button
              onClick={() => onPreview(asset)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Eye className="w-4 h-4" />
              Preview
            </button>

            {canApprove && (
              <>
                <button
                  onClick={() => onApprove(asset.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-green-50 text-green-700 hover:bg-green-100 rounded-lg transition-colors"
                >
                  <CheckCircle className="w-4 h-4" />
                  Approve
                </button>
                <button
                  onClick={() => setShowRejectModal(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-red-50 text-red-700 hover:bg-red-100 rounded-lg transition-colors"
                >
                  <XCircle className="w-4 h-4" />
                  Reject
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowRejectModal(false)}
          />
          <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md mx-4 p-6 animate-slideIn">
            <h3 className="font-medium text-gray-900 mb-4">Reject Asset</h3>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Please provide a reason for rejection..."
              className="input-field resize-none"
              rows={4}
            />
            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setShowRejectModal(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                disabled={!rejectReason.trim()}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                Submit Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function ApprovalQueue() {
  const { customizedAssets, updateCustomizedAsset, currentUser, addNotification } = useStore();

  const pendingAssets = customizedAssets.filter(
    (asset) => asset.status === 'pending_approval'
  );

  const handleApprove = (assetId: string) => {
    const asset = customizedAssets.find((a) => a.id === assetId);
    if (!asset) return;

    updateCustomizedAsset({
      ...asset,
      status: 'approved',
      approvalHistory: [
        ...asset.approvalHistory,
        {
          id: `approval-${Date.now()}`,
          userId: currentUser?.id || '',
          userName: currentUser?.name || '',
          action: 'approved',
          timestamp: new Date().toISOString(),
        },
      ],
    });

    addNotification({
      id: `notif-${Date.now()}`,
      userId: asset.createdBy,
      type: 'approved',
      title: 'Asset Approved',
      message: `Your asset "${asset.name}" has been approved!`,
      assetId: asset.id,
      read: false,
      createdAt: new Date().toISOString(),
    });
  };

  const handleReject = (assetId: string, reason: string) => {
    const asset = customizedAssets.find((a) => a.id === assetId);
    if (!asset) return;

    updateCustomizedAsset({
      ...asset,
      status: 'rejected',
      approvalHistory: [
        ...asset.approvalHistory,
        {
          id: `rejection-${Date.now()}`,
          userId: currentUser?.id || '',
          userName: currentUser?.name || '',
          action: 'rejected',
          comment: reason,
          timestamp: new Date().toISOString(),
        },
      ],
    });

    addNotification({
      id: `notif-${Date.now()}`,
      userId: asset.createdBy,
      type: 'rejected',
      title: 'Revisions Requested',
      message: `Your asset "${asset.name}" needs revisions: ${reason}`,
      assetId: asset.id,
      read: false,
      createdAt: new Date().toISOString(),
    });
  };

  const handlePreview = (asset: CustomizedAsset) => {
    // In a real app, this would open a preview modal
    console.log('Preview asset:', asset);
  };

  if (pendingAssets.length === 0) {
    return (
      <div className="card p-12 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">All caught up!</h3>
        <p className="text-gray-500 max-w-md mx-auto">
          There are no assets waiting for approval. New submissions will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-500">
          {pendingAssets.length} asset{pendingAssets.length !== 1 ? 's' : ''} pending review
        </p>
      </div>

      {pendingAssets.map((asset) => (
        <ApprovalItem
          key={asset.id}
          asset={asset}
          onApprove={handleApprove}
          onReject={handleReject}
          onPreview={handlePreview}
        />
      ))}
    </div>
  );
}
