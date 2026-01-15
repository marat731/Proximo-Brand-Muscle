'use client';

import React, { useState } from 'react';
import { useStore } from '@/store';
import Link from 'next/link';
import {
  ArrowLeft,
  ZoomIn,
  ZoomOut,
  Undo,
  Redo,
  Eye,
  Download,
  Send,
  Save,
  HelpCircle,
  MoreVertical,
} from 'lucide-react';
import clsx from 'clsx';

interface EditorToolbarProps {
  templateName: string;
  scale: number;
  onScaleChange: (scale: number) => void;
  onExport: () => void;
  onSubmitForApproval: () => void;
  onSave: () => void;
  onPreview: () => void;
}

export function EditorToolbar({
  templateName,
  scale,
  onScaleChange,
  onExport,
  onSubmitForApproval,
  onSave,
  onPreview,
}: EditorToolbarProps) {
  const { currentAsset } = useStore();
  const [showMenu, setShowMenu] = useState(false);

  const zoomLevels = [0.5, 0.75, 1, 1.25, 1.5, 2];

  const handleZoomIn = () => {
    const currentIndex = zoomLevels.indexOf(scale);
    if (currentIndex < zoomLevels.length - 1) {
      onScaleChange(zoomLevels[currentIndex + 1]);
    }
  };

  const handleZoomOut = () => {
    const currentIndex = zoomLevels.indexOf(scale);
    if (currentIndex > 0) {
      onScaleChange(zoomLevels[currentIndex - 1]);
    }
  };

  return (
    <div className="h-14 bg-white border-b border-gray-200 px-4 flex items-center justify-between">
      {/* Left Section */}
      <div className="flex items-center gap-4">
        <Link
          href="/templates"
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </Link>

        <div className="h-6 w-px bg-gray-200" />

        <div>
          <h2 className="font-medium text-gray-900 text-sm">{templateName}</h2>
          {currentAsset && (
            <p className="text-xs text-gray-500">
              {currentAsset.status === 'draft' ? 'Draft' : currentAsset.status}
            </p>
          )}
        </div>
      </div>

      {/* Center Section - Zoom Controls */}
      <div className="flex items-center gap-2">
        <button
          onClick={handleZoomOut}
          disabled={scale === zoomLevels[0]}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ZoomOut className="w-4 h-4 text-gray-600" />
        </button>

        <select
          value={scale}
          onChange={(e) => onScaleChange(parseFloat(e.target.value))}
          className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-proximo-gold"
        >
          {zoomLevels.map((level) => (
            <option key={level} value={level}>
              {Math.round(level * 100)}%
            </option>
          ))}
        </select>

        <button
          onClick={handleZoomIn}
          disabled={scale === zoomLevels[zoomLevels.length - 1]}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ZoomIn className="w-4 h-4 text-gray-600" />
        </button>
      </div>

      {/* Right Section - Actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={onPreview}
          className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Eye className="w-4 h-4" />
          <span className="text-sm">Preview</span>
        </button>

        <button
          onClick={onSave}
          className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Save className="w-4 h-4" />
          <span className="text-sm">Save</span>
        </button>

        <div className="h-6 w-px bg-gray-200" />

        <button
          onClick={onSubmitForApproval}
          className="flex items-center gap-2 px-4 py-2 bg-proximo-charcoal text-white rounded-lg hover:bg-opacity-90 transition-colors"
        >
          <Send className="w-4 h-4" />
          <span className="text-sm font-medium">Submit</span>
        </button>

        <button
          onClick={onExport}
          className="flex items-center gap-2 px-4 py-2 bg-proximo-gold text-white rounded-lg hover:bg-opacity-90 transition-colors"
        >
          <Download className="w-4 h-4" />
          <span className="text-sm font-medium">Export</span>
        </button>

        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <MoreVertical className="w-4 h-4 text-gray-600" />
          </button>

          {showMenu && (
            <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-50 animate-fadeIn">
              <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                <HelpCircle className="w-4 h-4" />
                Help & Guidelines
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
