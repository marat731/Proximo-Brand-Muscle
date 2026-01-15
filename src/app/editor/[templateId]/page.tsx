'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useStore } from '@/store';
import { EditorCanvas } from '@/components/editor/EditorCanvas';
import { EditorToolbar } from '@/components/editor/EditorToolbar';
import { PropertiesPanel } from '@/components/editor/PropertiesPanel';
import { ExportModal } from '@/components/editor/ExportModal';
import { ApprovalModal } from '@/components/approval/ApprovalModal';
import { AssetLibraryPanel } from '@/components/editor/AssetLibraryPanel';
import { Library } from 'lucide-react';

export default function EditorPage() {
  const params = useParams();
  const router = useRouter();
  const templateId = params.templateId as string;

  const {
    templates,
    setCurrentTemplate,
    currentTemplate,
    setCurrentAsset,
    currentAsset,
    currentUser,
    addCustomizedAsset,
    updateCustomizedAsset,
    addNotification,
    setAssetLibraryOpen,
    assetLibraryOpen,
  } = useStore();

  const [scale, setScale] = useState(1);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showApprovalModal, setShowApprovalModal] = useState(false);

  // Initialize template and asset
  useEffect(() => {
    const template = templates.find((t) => t.id === templateId);
    if (template) {
      setCurrentTemplate(template);

      // Create a new customized asset from the template
      const newAsset = {
        id: `asset-${Date.now()}`,
        templateId: template.id,
        name: `${template.name} - ${new Date().toLocaleDateString()}`,
        elements: JSON.parse(JSON.stringify(template.elements)), // Deep copy
        createdBy: currentUser?.name || 'Unknown',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: 'draft' as const,
        approvalHistory: [],
        exportHistory: [],
      };
      setCurrentAsset(newAsset);
    }

    return () => {
      setCurrentTemplate(null);
      setCurrentAsset(null);
    };
  }, [templateId, templates, setCurrentTemplate, setCurrentAsset, currentUser]);

  if (!currentTemplate || !currentAsset) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-proximo-gold border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading template...</p>
        </div>
      </div>
    );
  }

  const handleSave = () => {
    if (currentAsset) {
      const existingIndex = useStore
        .getState()
        .customizedAssets.findIndex((a) => a.id === currentAsset.id);

      if (existingIndex >= 0) {
        updateCustomizedAsset(currentAsset);
      } else {
        addCustomizedAsset(currentAsset);
      }

      addNotification({
        id: `notif-${Date.now()}`,
        userId: currentUser?.id || '',
        type: 'comment',
        title: 'Asset Saved',
        message: 'Your changes have been saved as a draft.',
        assetId: currentAsset.id,
        read: false,
        createdAt: new Date().toISOString(),
      });
    }
  };

  const handleSubmitForApproval = (data: {
    marketId: string;
    retailerId: string;
    notes: string;
  }) => {
    if (currentAsset) {
      const updatedAsset = {
        ...currentAsset,
        status: 'pending_approval' as const,
        marketId: data.marketId,
        retailerId: data.retailerId,
        updatedAt: new Date().toISOString(),
        approvalHistory: [
          ...currentAsset.approvalHistory,
          {
            id: `submission-${Date.now()}`,
            userId: currentUser?.id || '',
            userName: currentUser?.name || '',
            action: 'submitted' as const,
            comment: data.notes,
            timestamp: new Date().toISOString(),
          },
        ],
      };

      // Save or update the asset
      const existingIndex = useStore
        .getState()
        .customizedAssets.findIndex((a) => a.id === currentAsset.id);

      if (existingIndex >= 0) {
        updateCustomizedAsset(updatedAsset);
      } else {
        addCustomizedAsset(updatedAsset);
      }

      setCurrentAsset(updatedAsset);
      setShowApprovalModal(false);

      addNotification({
        id: `notif-${Date.now()}`,
        userId: currentUser?.id || '',
        type: 'approval_needed',
        title: 'Asset Submitted',
        message: 'Your asset has been submitted for approval.',
        assetId: currentAsset.id,
        read: false,
        createdAt: new Date().toISOString(),
      });
    }
  };

  const handlePreview = () => {
    // In a real app, this would open a full preview modal
    window.open(`/preview/${currentAsset.id}`, '_blank');
  };

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* Toolbar */}
      <EditorToolbar
        templateName={currentAsset.name}
        scale={scale}
        onScaleChange={setScale}
        onExport={() => setShowExportModal(true)}
        onSubmitForApproval={() => setShowApprovalModal(true)}
        onSave={handleSave}
        onPreview={handlePreview}
      />

      {/* Main Editor Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Canvas */}
        <div className="flex-1 relative">
          <EditorCanvas scale={scale} />

          {/* Asset Library Toggle */}
          <button
            onClick={() => setAssetLibraryOpen(true)}
            className="absolute bottom-6 left-6 flex items-center gap-2 px-4 py-3 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow"
          >
            <Library className="w-5 h-5 text-proximo-gold" />
            <span className="font-medium text-gray-900">Asset Library</span>
          </button>
        </div>

        {/* Properties Panel */}
        <PropertiesPanel />
      </div>

      {/* Modals */}
      <ExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
      />

      <ApprovalModal
        isOpen={showApprovalModal}
        onClose={() => setShowApprovalModal(false)}
        onSubmit={handleSubmitForApproval}
      />

      <AssetLibraryPanel
        isOpen={assetLibraryOpen}
        onClose={() => setAssetLibraryOpen(false)}
      />
    </div>
  );
}
