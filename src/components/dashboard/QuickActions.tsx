'use client';

import React from 'react';
import Link from 'next/link';
import { useStore } from '@/store';
import {
  Plus,
  FileImage,
  FolderOpen,
  CheckCircle,
  ArrowRight,
} from 'lucide-react';
import clsx from 'clsx';

interface QuickAction {
  id: string;
  label: string;
  description: string;
  href: string;
  icon: React.ReactNode;
  color: string;
}

const quickActions: QuickAction[] = [
  {
    id: 'new-asset',
    label: 'Create New Asset',
    description: 'Start from an approved template',
    href: '/templates',
    icon: <Plus className="w-5 h-5" />,
    color: 'bg-proximo-gold hover:bg-proximo-gold/90',
  },
  {
    id: 'my-assets',
    label: 'My Assets',
    description: 'View and manage your work',
    href: '/assets',
    icon: <FolderOpen className="w-5 h-5" />,
    color: 'bg-proximo-charcoal hover:bg-proximo-charcoal/90',
  },
  {
    id: 'approvals',
    label: 'Review Queue',
    description: 'Assets pending approval',
    href: '/approvals',
    icon: <CheckCircle className="w-5 h-5" />,
    color: 'bg-proximo-blue hover:bg-proximo-blue/90',
  },
];

export function QuickActions() {
  const { currentUser } = useStore();

  return (
    <div className="card p-6">
      <h3 className="font-display font-bold text-gray-900 mb-4">Quick Actions</h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {quickActions.map((action) => {
          // Hide approval queue for field team
          if (
            action.id === 'approvals' &&
            currentUser?.role === 'field_team'
          ) {
            return null;
          }

          return (
            <Link
              key={action.id}
              href={action.href}
              className={clsx(
                'flex items-center gap-4 p-4 rounded-xl text-white transition-all group',
                action.color
              )}
            >
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                {action.icon}
              </div>
              <div className="flex-1">
                <p className="font-medium">{action.label}</p>
                <p className="text-sm text-white/70">{action.description}</p>
              </div>
              <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
