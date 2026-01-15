'use client';

import React from 'react';
import Link from 'next/link';
import { useStore } from '@/store';
import { ArrowRight, FileImage } from 'lucide-react';

export function BrandOverview() {
  const { brands, templates, currentUser } = useStore();

  // Filter brands based on user access
  const accessibleBrands = brands.filter((brand) => {
    if (currentUser?.role === 'admin' || currentUser?.role === 'brand_manager') {
      return true;
    }
    return currentUser?.assignedBrands.includes(brand.id);
  });

  return (
    <div className="card">
      <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
        <h3 className="font-display font-bold text-gray-900">Your Brands</h3>
        <Link
          href="/templates"
          className="text-sm text-proximo-gold hover:underline flex items-center gap-1"
        >
          View all templates
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {accessibleBrands.map((brand) => {
            const brandTemplates = templates.filter(
              (t) => t.brandId === brand.id && t.status === 'approved'
            );

            return (
              <Link
                key={brand.id}
                href={`/templates?brand=${brand.id}`}
                className="group"
              >
                <div
                  className="aspect-square rounded-xl flex items-center justify-center mb-3 transition-transform group-hover:scale-105"
                  style={{ backgroundColor: brand.colors.background }}
                >
                  <div
                    className="w-16 h-16 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: brand.colors.primary }}
                  >
                    <span className="text-2xl font-display font-bold text-white">
                      {brand.name.charAt(0)}
                    </span>
                  </div>
                </div>
                <p className="font-medium text-gray-900 text-sm text-center group-hover:text-proximo-gold transition-colors">
                  {brand.name}
                </p>
                <p className="text-xs text-gray-500 text-center mt-0.5">
                  {brandTemplates.length} template{brandTemplates.length !== 1 ? 's' : ''}
                </p>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
