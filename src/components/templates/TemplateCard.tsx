'use client';

import React from 'react';
import Link from 'next/link';
import { Template, Brand } from '@/types';
import { useStore } from '@/store';
import {
  FileImage,
  Monitor,
  Tag,
  Clock,
  CheckCircle,
  Lock,
} from 'lucide-react';
import clsx from 'clsx';

interface TemplateCardProps {
  template: Template;
}

const formatIcons: Record<string, React.ReactNode> = {
  'shelf-talker': <Tag className="w-4 h-4" />,
  'end-cap': <FileImage className="w-4 h-4" />,
  'digital-screen': <Monitor className="w-4 h-4" />,
};

export function TemplateCard({ template }: TemplateCardProps) {
  const { brands } = useStore();
  const brand = brands.find((b) => b.id === template.brandId);

  const formatLabel = template.format
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

  return (
    <Link href={`/editor/${template.id}`}>
      <div className="card-hover group">
        {/* Thumbnail */}
        <div
          className="relative aspect-[4/3] overflow-hidden"
          style={{ backgroundColor: brand?.colors.background || '#f5f5f5' }}
        >
          {/* Placeholder for template preview */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className="w-32 h-32 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: brand?.colors.primary || '#C5A572' }}
            >
              <FileImage className="w-12 h-12 text-white/80" />
            </div>
          </div>

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-proximo-dark/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <span className="px-4 py-2 bg-white rounded-lg font-medium text-proximo-dark text-sm">
              Customize Template
            </span>
          </div>

          {/* Status badge */}
          <div className="absolute top-3 right-3">
            {template.status === 'approved' ? (
              <span className="badge-success flex items-center gap-1">
                <CheckCircle className="w-3 h-3" />
                Approved
              </span>
            ) : (
              <span className="badge-warning">Draft</span>
            )}
          </div>

          {/* Brand indicator */}
          <div
            className="absolute bottom-0 left-0 right-0 h-1"
            style={{ backgroundColor: brand?.colors.primary || '#C5A572' }}
          />
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-medium text-gray-900 group-hover:text-proximo-gold transition-colors line-clamp-1">
              {template.name}
            </h3>
          </div>

          <p className="text-sm text-gray-500 line-clamp-2 mb-3">
            {template.description}
          </p>

          <div className="flex items-center justify-between text-xs text-gray-400">
            <div className="flex items-center gap-1">
              {formatIcons[template.format] || <FileImage className="w-4 h-4" />}
              <span>{formatLabel}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>v{template.version}</span>
            </div>
          </div>

          {/* Tags */}
          {template.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-3">
              {template.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs"
                >
                  {tag}
                </span>
              ))}
              {template.tags.length > 3 && (
                <span className="px-2 py-0.5 text-gray-400 text-xs">
                  +{template.tags.length - 3}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
