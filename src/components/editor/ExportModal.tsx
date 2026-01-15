'use client';

import React, { useState } from 'react';
import { useStore } from '@/store';
import {
  X,
  Download,
  FileImage,
  FileText,
  Monitor,
  Printer,
  Check,
  Loader2,
} from 'lucide-react';
import clsx from 'clsx';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type ExportFormat = 'png' | 'jpg' | 'pdf';
type ExportResolution = 'web' | 'print';

const formatOptions: { value: ExportFormat; label: string; icon: React.ReactNode; description: string }[] = [
  {
    value: 'png',
    label: 'PNG',
    icon: <FileImage className="w-5 h-5" />,
    description: 'High quality with transparency',
  },
  {
    value: 'jpg',
    label: 'JPG',
    icon: <FileImage className="w-5 h-5" />,
    description: 'Smaller file size, no transparency',
  },
  {
    value: 'pdf',
    label: 'PDF',
    icon: <FileText className="w-5 h-5" />,
    description: 'Print-ready document format',
  },
];

const resolutionOptions: { value: ExportResolution; label: string; icon: React.ReactNode; description: string }[] = [
  {
    value: 'web',
    label: 'Web / Digital',
    icon: <Monitor className="w-5 h-5" />,
    description: '72 DPI - Optimized for screens',
  },
  {
    value: 'print',
    label: 'Print',
    icon: <Printer className="w-5 h-5" />,
    description: '300 DPI - High resolution for printing',
  },
];

export function ExportModal({ isOpen, onClose }: ExportModalProps) {
  const { currentAsset, addNotification, currentUser } = useStore();
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>('png');
  const [selectedResolution, setSelectedResolution] = useState<ExportResolution>('print');
  const [isExporting, setIsExporting] = useState(false);
  const [exportComplete, setExportComplete] = useState(false);

  if (!isOpen) return null;

  const handleExport = async () => {
    setIsExporting(true);

    // Simulate export process
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsExporting(false);
    setExportComplete(true);

    // Add notification
    addNotification({
      id: `notif-${Date.now()}`,
      userId: currentUser?.id || '',
      type: 'export_ready',
      title: 'Export Complete',
      message: `Your ${selectedFormat.toUpperCase()} file is ready for download.`,
      assetId: currentAsset?.id,
      read: false,
      createdAt: new Date().toISOString(),
    });

    // Reset after a moment
    setTimeout(() => {
      setExportComplete(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 animate-slideIn">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-display font-bold text-gray-900">
            Export Asset
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Format Selection */}
          <div>
            <label className="label mb-3">File Format</label>
            <div className="grid grid-cols-3 gap-3">
              {formatOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setSelectedFormat(option.value)}
                  className={clsx(
                    'p-4 rounded-lg border-2 transition-all text-left',
                    selectedFormat === option.value
                      ? 'border-proximo-gold bg-proximo-gold/5'
                      : 'border-gray-200 hover:border-gray-300'
                  )}
                >
                  <div
                    className={clsx(
                      'mb-2',
                      selectedFormat === option.value
                        ? 'text-proximo-gold'
                        : 'text-gray-400'
                    )}
                  >
                    {option.icon}
                  </div>
                  <div className="font-medium text-sm">{option.label}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {option.description}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Resolution Selection */}
          <div>
            <label className="label mb-3">Resolution</label>
            <div className="grid grid-cols-2 gap-3">
              {resolutionOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setSelectedResolution(option.value)}
                  className={clsx(
                    'p-4 rounded-lg border-2 transition-all text-left',
                    selectedResolution === option.value
                      ? 'border-proximo-gold bg-proximo-gold/5'
                      : 'border-gray-200 hover:border-gray-300'
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={clsx(
                        selectedResolution === option.value
                          ? 'text-proximo-gold'
                          : 'text-gray-400'
                      )}
                    >
                      {option.icon}
                    </div>
                    <div>
                      <div className="font-medium text-sm">{option.label}</div>
                      <div className="text-xs text-gray-500">
                        {option.description}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Export Info */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="text-sm font-medium text-gray-700 mb-2">
              Export Summary
            </h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>Format: {selectedFormat.toUpperCase()}</li>
              <li>Resolution: {selectedResolution === 'web' ? '72 DPI' : '300 DPI'}</li>
              <li>Estimated size: ~{selectedResolution === 'web' ? '500KB' : '2.5MB'}</li>
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
            onClick={handleExport}
            disabled={isExporting || exportComplete}
            className={clsx(
              'flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition-all',
              exportComplete
                ? 'bg-green-500 text-white'
                : 'bg-proximo-gold text-white hover:bg-opacity-90'
            )}
          >
            {isExporting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Exporting...
              </>
            ) : exportComplete ? (
              <>
                <Check className="w-4 h-4" />
                Downloaded!
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                Export
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
