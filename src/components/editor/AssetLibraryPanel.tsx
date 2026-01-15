'use client';

import React, { useState } from 'react';
import { useStore } from '@/store';
import { SKU, LibraryAsset } from '@/types';
import {
  Search,
  Package,
  Image as ImageIcon,
  Palette,
  Award,
  X,
  ChevronDown,
} from 'lucide-react';
import clsx from 'clsx';

interface AssetLibraryPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSKU?: (sku: SKU) => void;
  onSelectAsset?: (asset: LibraryAsset) => void;
}

type TabType = 'skus' | 'backgrounds' | 'badges' | 'logos';

const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
  { id: 'skus', label: 'Products', icon: <Package className="w-4 h-4" /> },
  { id: 'backgrounds', label: 'Backgrounds', icon: <ImageIcon className="w-4 h-4" /> },
  { id: 'badges', label: 'Badges', icon: <Award className="w-4 h-4" /> },
  { id: 'logos', label: 'Logos', icon: <Palette className="w-4 h-4" /> },
];

export function AssetLibraryPanel({
  isOpen,
  onClose,
  onSelectSKU,
  onSelectAsset,
}: AssetLibraryPanelProps) {
  const { skus, backgrounds, badges, logos, brands } = useStore();
  const [activeTab, setActiveTab] = useState<TabType>('skus');
  const [searchQuery, setSearchQuery] = useState('');
  const [brandFilter, setBrandFilter] = useState<string>('all');

  if (!isOpen) return null;

  const filteredSKUs = skus.filter((sku) => {
    const matchesSearch =
      sku.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sku.variant.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sku.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesBrand = brandFilter === 'all' || sku.brandId === brandFilter;
    return matchesSearch && matchesBrand;
  });

  const filteredAssets = (assets: LibraryAsset[]) =>
    assets.filter((asset) => {
      const matchesSearch =
        asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        asset.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesBrand =
        brandFilter === 'all' || !asset.brandId || asset.brandId === brandFilter;
      return matchesSearch && matchesBrand;
    });

  return (
    <div className="fixed inset-y-0 right-0 w-96 bg-white shadow-xl z-50 flex flex-col animate-slideIn">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
        <h2 className="font-display font-bold text-gray-900">Asset Library</h2>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={clsx(
              'flex-1 flex items-center justify-center gap-2 px-3 py-3 text-sm transition-colors',
              activeTab === tab.id
                ? 'text-proximo-gold border-b-2 border-proximo-gold'
                : 'text-gray-500 hover:text-gray-700'
            )}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="p-4 space-y-3 border-b border-gray-100">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder={`Search ${tabs.find((t) => t.id === activeTab)?.label.toLowerCase()}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm
                     focus:outline-none focus:ring-2 focus:ring-proximo-gold focus:border-transparent"
          />
        </div>

        {/* Brand Filter */}
        <div className="relative">
          <select
            value={brandFilter}
            onChange={(e) => setBrandFilter(e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm appearance-none
                     focus:outline-none focus:ring-2 focus:ring-proximo-gold focus:border-transparent"
          >
            <option value="all">All Brands</option>
            {brands.map((brand) => (
              <option key={brand.id} value={brand.id}>
                {brand.name}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* SKUs Tab */}
        {activeTab === 'skus' && (
          <div className="grid grid-cols-2 gap-3">
            {filteredSKUs.map((sku) => (
              <button
                key={sku.id}
                onClick={() => onSelectSKU?.(sku)}
                className="p-3 border border-gray-200 rounded-lg hover:border-proximo-gold hover:bg-proximo-gold/5 transition-colors text-left"
              >
                <div className="aspect-square mb-2 bg-gray-50 rounded-lg overflow-hidden">
                  <div
                    className="w-full h-full bg-contain bg-center bg-no-repeat"
                    style={{ backgroundImage: `url(${sku.imageUrl})` }}
                  />
                </div>
                <p className="text-xs font-medium text-gray-900 line-clamp-1">
                  {sku.name}
                </p>
                <p className="text-xs text-gray-500">{sku.variant}</p>
              </button>
            ))}
            {filteredSKUs.length === 0 && (
              <div className="col-span-2 text-center py-8 text-gray-500 text-sm">
                No products found
              </div>
            )}
          </div>
        )}

        {/* Backgrounds Tab */}
        {activeTab === 'backgrounds' && (
          <div className="grid grid-cols-2 gap-3">
            {filteredAssets(backgrounds).map((asset) => (
              <button
                key={asset.id}
                onClick={() => onSelectAsset?.(asset)}
                className="p-2 border border-gray-200 rounded-lg hover:border-proximo-gold hover:bg-proximo-gold/5 transition-colors text-left"
              >
                <div className="aspect-video mb-2 bg-gray-100 rounded overflow-hidden">
                  <div
                    className="w-full h-full bg-cover bg-center"
                    style={{ backgroundImage: `url(${asset.thumbnailUrl})` }}
                  />
                </div>
                <p className="text-xs font-medium text-gray-900 line-clamp-1">
                  {asset.name}
                </p>
              </button>
            ))}
            {filteredAssets(backgrounds).length === 0 && (
              <div className="col-span-2 text-center py-8 text-gray-500 text-sm">
                No backgrounds found
              </div>
            )}
          </div>
        )}

        {/* Badges Tab */}
        {activeTab === 'badges' && (
          <div className="grid grid-cols-3 gap-3">
            {filteredAssets(badges).map((asset) => (
              <button
                key={asset.id}
                onClick={() => onSelectAsset?.(asset)}
                className="p-3 border border-gray-200 rounded-lg hover:border-proximo-gold hover:bg-proximo-gold/5 transition-colors"
              >
                <div className="aspect-square mb-2">
                  <div
                    className="w-full h-full bg-contain bg-center bg-no-repeat"
                    style={{ backgroundImage: `url(${asset.thumbnailUrl})` }}
                  />
                </div>
                <p className="text-xs font-medium text-gray-900 text-center line-clamp-1">
                  {asset.name}
                </p>
              </button>
            ))}
            {filteredAssets(badges).length === 0 && (
              <div className="col-span-3 text-center py-8 text-gray-500 text-sm">
                No badges found
              </div>
            )}
          </div>
        )}

        {/* Logos Tab */}
        {activeTab === 'logos' && (
          <div className="grid grid-cols-2 gap-3">
            {filteredAssets(logos).map((asset) => (
              <button
                key={asset.id}
                onClick={() => onSelectAsset?.(asset)}
                className="p-4 border border-gray-200 rounded-lg hover:border-proximo-gold hover:bg-proximo-gold/5 transition-colors"
              >
                <div className="aspect-video mb-2 flex items-center justify-center">
                  <div
                    className="w-full h-full bg-contain bg-center bg-no-repeat"
                    style={{ backgroundImage: `url(${asset.thumbnailUrl})` }}
                  />
                </div>
                <p className="text-xs font-medium text-gray-900 text-center line-clamp-1">
                  {asset.name}
                </p>
              </button>
            ))}
            {filteredAssets(logos).length === 0 && (
              <div className="col-span-2 text-center py-8 text-gray-500 text-sm">
                No logos found
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <p className="text-xs text-gray-500 text-center">
          All assets are brand-approved and ready for use
        </p>
      </div>
    </div>
  );
}
