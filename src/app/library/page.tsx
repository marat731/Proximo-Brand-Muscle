'use client';

import React, { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Header } from '@/components/layout/Header';
import { useStore } from '@/store';
import {
  Package,
  Image,
  Award,
  Palette,
  Search,
  ChevronDown,
  Download,
  Eye,
} from 'lucide-react';
import clsx from 'clsx';

type TabType = 'skus' | 'logos' | 'backgrounds' | 'badges';

const tabs = [
  { id: 'skus' as TabType, label: 'Products', icon: Package, count: 14 },
  { id: 'logos' as TabType, label: 'Logos', icon: Palette, count: 5 },
  { id: 'backgrounds' as TabType, label: 'Backgrounds', icon: Image, count: 4 },
  { id: 'badges' as TabType, label: 'Badges', icon: Award, count: 5 },
];

export default function LibraryPage() {
  const { skus, logos, backgrounds, badges, brands } = useStore();
  const [activeTab, setActiveTab] = useState<TabType>('skus');
  const [searchQuery, setSearchQuery] = useState('');
  const [brandFilter, setBrandFilter] = useState('all');

  const filteredSKUs = skus.filter((sku) => {
    const matchesSearch =
      sku.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sku.variant.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesBrand = brandFilter === 'all' || sku.brandId === brandFilter;
    return matchesSearch && matchesBrand;
  });

  const filterAssets = (assets: typeof logos) =>
    assets.filter((asset) => {
      const matchesSearch = asset.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesBrand =
        brandFilter === 'all' || !asset.brandId || asset.brandId === brandFilter;
      return matchesSearch && matchesBrand;
    });

  return (
    <MainLayout>
      <Header
        title="Asset Library"
        subtitle="Browse all approved brand assets"
        showSearch
        onSearch={setSearchQuery}
      />

      <div className="p-6">
        {/* Tabs */}
        <div className="flex items-center gap-4 mb-6 border-b border-gray-200">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={clsx(
                  'flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 -mb-px transition-colors',
                  activeTab === tab.id
                    ? 'border-proximo-gold text-proximo-gold'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                )}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
                <span className="ml-1 px-2 py-0.5 bg-gray-100 rounded-full text-xs">
                  {tab.count}
                </span>
              </button>
            );
          })}

          {/* Brand Filter */}
          <div className="ml-auto relative">
            <select
              value={brandFilter}
              onChange={(e) => setBrandFilter(e.target.value)}
              className="select-field pr-8 appearance-none min-w-[160px]"
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

        {/* Products Tab */}
        {activeTab === 'skus' && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {filteredSKUs.map((sku) => {
              const brand = brands.find((b) => b.id === sku.brandId);
              return (
                <div key={sku.id} className="card-hover group">
                  <div className="aspect-square p-4 bg-gray-50">
                    <div
                      className="w-full h-full bg-contain bg-center bg-no-repeat"
                      style={{ backgroundImage: `url(${sku.imageUrl})` }}
                    />
                  </div>
                  <div className="p-3">
                    <p className="text-sm font-medium text-gray-900 line-clamp-1">
                      {sku.name}
                    </p>
                    <p className="text-xs text-gray-500">{sku.variant}</p>
                    <div className="flex items-center gap-1 mt-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: brand?.colors.primary }}
                      />
                      <span className="text-xs text-gray-400">{brand?.name}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Logos Tab */}
        {activeTab === 'logos' && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filterAssets(logos).map((asset) => {
              const brand = brands.find((b) => b.id === asset.brandId);
              return (
                <div key={asset.id} className="card-hover group">
                  <div className="aspect-video p-6 bg-gray-50 flex items-center justify-center">
                    <div
                      className="w-full h-full bg-contain bg-center bg-no-repeat"
                      style={{ backgroundImage: `url(${asset.thumbnailUrl})` }}
                    />
                  </div>
                  <div className="p-3">
                    <p className="text-sm font-medium text-gray-900 line-clamp-1">
                      {asset.name}
                    </p>
                    <p className="text-xs text-gray-500">{brand?.name}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Backgrounds Tab */}
        {activeTab === 'backgrounds' && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {filterAssets(backgrounds).map((asset) => {
              const brand = brands.find((b) => b.id === asset.brandId);
              return (
                <div key={asset.id} className="card-hover group">
                  <div
                    className="aspect-video bg-cover bg-center"
                    style={{ backgroundImage: `url(${asset.thumbnailUrl})` }}
                  />
                  <div className="p-3">
                    <p className="text-sm font-medium text-gray-900 line-clamp-1">
                      {asset.name}
                    </p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {asset.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Badges Tab */}
        {activeTab === 'badges' && (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
            {filterAssets(badges).map((asset) => (
              <div key={asset.id} className="card-hover group">
                <div className="aspect-square p-4 bg-gray-50 flex items-center justify-center">
                  <div
                    className="w-full h-full bg-contain bg-center bg-no-repeat"
                    style={{ backgroundImage: `url(${asset.thumbnailUrl})` }}
                  />
                </div>
                <div className="p-2">
                  <p className="text-xs font-medium text-gray-900 text-center line-clamp-1">
                    {asset.name}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
