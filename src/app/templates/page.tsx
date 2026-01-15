'use client';

import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Header } from '@/components/layout/Header';
import { TemplateGallery } from '@/components/templates/TemplateGallery';
import { useStore } from '@/store';

export default function TemplatesPage() {
  const { templates } = useStore();
  const approvedCount = templates.filter((t) => t.status === 'approved').length;

  return (
    <MainLayout>
      <Header
        title="Template Gallery"
        subtitle={`${approvedCount} approved templates ready to customize`}
        showSearch
        showFilters
      />

      <div className="p-6">
        <TemplateGallery />
      </div>
    </MainLayout>
  );
}
