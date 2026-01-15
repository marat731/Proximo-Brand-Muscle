'use client';

import React, { useState, useMemo } from 'react';
import { useStore } from '@/store';
import { TemplateCard } from './TemplateCard';
import { AssetFormat, Template } from '@/types';
import { Filter, Grid, List, ChevronDown } from 'lucide-react';
import clsx from 'clsx';

interface TemplateGalleryProps {
  brandFilter?: string;
  formatFilter?: AssetFormat;
}

const formatOptions: { value: AssetFormat | 'all'; label: string }[] = [
  { value: 'all', label: 'All Formats' },
  { value: 'shelf-talker', label: 'Shelf Talkers' },
  { value: 'end-cap', label: 'End Caps' },
  { value: 'floor-display', label: 'Floor Displays' },
  { value: 'digital-screen', label: 'Digital Screens' },
  { value: 'poster', label: 'Posters' },
  { value: 'price-card', label: 'Price Cards' },
];

export function TemplateGallery({ brandFilter, formatFilter }: TemplateGalleryProps) {
  const { templates, brands, currentUser } = useStore();
  const [selectedBrand, setSelectedBrand] = useState<string>(brandFilter || 'all');
  const [selectedFormat, setSelectedFormat] = useState<AssetFormat | 'all'>(formatFilter || 'all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Filter templates based on user's assigned brands
  const accessibleBrands = useMemo(() => {
    if (currentUser?.role === 'admin' || currentUser?.role === 'brand_manager') {
      return brands;
    }
    return brands.filter((b) => currentUser?.assignedBrands.includes(b.id));
  }, [brands, currentUser]);

  const filteredTemplates = useMemo(() => {
    return templates.filter((template) => {
      // Check brand access
      const hasAccess =
        currentUser?.role === 'admin' ||
        currentUser?.role === 'brand_manager' ||
        currentUser?.assignedBrands.includes(template.brandId);

      if (!hasAccess) return false;

      // Brand filter
      if (selectedBrand !== 'all' && template.brandId !== selectedBrand) {
        return false;
      }

      // Format filter
      if (selectedFormat !== 'all' && template.format !== selectedFormat) {
        return false;
      }

      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          template.name.toLowerCase().includes(query) ||
          template.description.toLowerCase().includes(query) ||
          template.tags.some((tag) => tag.toLowerCase().includes(query))
        );
      }

      // Only show approved templates
      return template.status === 'approved';
    });
  }, [templates, selectedBrand, selectedFormat, searchQuery, currentUser]);

  return (
    <div>
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        {/* Brand Filter */}
        <div className="relative">
          <select
            value={selectedBrand}
            onChange={(e) => setSelectedBrand(e.target.value)}
            className="select-field pr-8 appearance-none min-w-[180px]"
          >
            <option value="all">All Brands</option>
            {accessibleBrands.map((brand) => (
              <option key={brand.id} value={brand.id}>
                {brand.name}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>

        {/* Format Filter */}
        <div className="relative">
          <select
            value={selectedFormat}
            onChange={(e) => setSelectedFormat(e.target.value as AssetFormat | 'all')}
            className="select-field pr-8 appearance-none min-w-[160px]"
          >
            {formatOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>

        {/* View Mode Toggle */}
        <div className="ml-auto flex items-center gap-1 p-1 bg-white rounded-lg border border-gray-200">
          <button
            onClick={() => setViewMode('grid')}
            className={clsx(
              'p-2 rounded transition-colors',
              viewMode === 'grid'
                ? 'bg-proximo-gold text-white'
                : 'text-gray-500 hover:bg-gray-100'
            )}
          >
            <Grid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={clsx(
              'p-2 rounded transition-colors',
              viewMode === 'list'
                ? 'bg-proximo-gold text-white'
                : 'text-gray-500 hover:bg-gray-100'
            )}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Results count */}
      <div className="text-sm text-gray-500 mb-4">
        Showing {filteredTemplates.length} template{filteredTemplates.length !== 1 ? 's' : ''}
      </div>

      {/* Template Grid */}
      {filteredTemplates.length === 0 ? (
        <div className="card p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Filter className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No templates found</h3>
          <p className="text-gray-500 max-w-md mx-auto">
            Try adjusting your filters or search query to find the templates you're looking for.
          </p>
        </div>
      ) : (
        <div
          className={clsx(
            viewMode === 'grid'
              ? 'template-grid'
              : 'flex flex-col gap-4'
          )}
        >
          {filteredTemplates.map((template) => (
            <TemplateCard key={template.id} template={template} />
          ))}
        </div>
      )}
    </div>
  );
}
