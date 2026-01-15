'use client';

import React, { useState } from 'react';
import { useStore } from '@/store';
import {
  X,
  Send,
  Building,
  MapPin,
  MessageSquare,
  ChevronDown,
  AlertCircle,
} from 'lucide-react';
import clsx from 'clsx';

interface ApprovalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ApprovalSubmission) => void;
}

interface ApprovalSubmission {
  marketId: string;
  retailerId: string;
  notes: string;
}

export function ApprovalModal({ isOpen, onClose, onSubmit }: ApprovalModalProps) {
  const { markets, currentAsset } = useStore();
  const [selectedMarket, setSelectedMarket] = useState('');
  const [selectedRetailer, setSelectedRetailer] = useState('');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  const selectedMarketData = markets.find((m) => m.id === selectedMarket);
  const retailers = selectedMarketData?.retailers || [];

  const handleSubmit = () => {
    const newErrors: Record<string, string> = {};

    if (!selectedMarket) {
      newErrors.market = 'Please select a market';
    }
    if (!selectedRetailer) {
      newErrors.retailer = 'Please select a retailer';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit({
      marketId: selectedMarket,
      retailerId: selectedRetailer,
      notes,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 animate-slideIn">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-display font-bold text-gray-900">
              Submit for Approval
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">
              Send this asset to your brand manager for review
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Market Selection */}
          <div>
            <label className="label flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Target Market
            </label>
            <div className="relative">
              <select
                value={selectedMarket}
                onChange={(e) => {
                  setSelectedMarket(e.target.value);
                  setSelectedRetailer('');
                  setErrors({ ...errors, market: '' });
                }}
                className={clsx(
                  'select-field pr-8 appearance-none',
                  errors.market && 'border-red-500 focus:ring-red-500'
                )}
              >
                <option value="">Select a market...</option>
                {markets.map((market) => (
                  <option key={market.id} value={market.id}>
                    {market.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
            {errors.market && (
              <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.market}
              </p>
            )}
          </div>

          {/* Retailer Selection */}
          <div>
            <label className="label flex items-center gap-2">
              <Building className="w-4 h-4" />
              Target Retailer
            </label>
            <div className="relative">
              <select
                value={selectedRetailer}
                onChange={(e) => {
                  setSelectedRetailer(e.target.value);
                  setErrors({ ...errors, retailer: '' });
                }}
                disabled={!selectedMarket}
                className={clsx(
                  'select-field pr-8 appearance-none',
                  errors.retailer && 'border-red-500 focus:ring-red-500',
                  !selectedMarket && 'bg-gray-100 cursor-not-allowed'
                )}
              >
                <option value="">Select a retailer...</option>
                {retailers.map((retailer) => (
                  <option key={retailer.id} value={retailer.id}>
                    {retailer.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
            {errors.retailer && (
              <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.retailer}
              </p>
            )}
          </div>

          {/* Notes */}
          <div>
            <label className="label flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Notes (Optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any context or notes for the reviewer..."
              className="input-field resize-none"
              rows={3}
            />
          </div>

          {/* Info Box */}
          <div className="p-4 bg-proximo-gold/5 rounded-lg border border-proximo-gold/20">
            <h4 className="text-sm font-medium text-proximo-gold mb-2">
              What happens next?
            </h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>1. Your brand manager will receive a notification</li>
              <li>2. They will review for brand compliance</li>
              <li>3. You will be notified when approved or if changes needed</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="flex items-center gap-2 px-6 py-2 bg-proximo-gold text-white rounded-lg font-medium hover:bg-opacity-90 transition-colors"
          >
            <Send className="w-4 h-4" />
            Submit for Review
          </button>
        </div>
      </div>
    </div>
  );
}
