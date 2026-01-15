'use client';

import React from 'react';
import { useStore } from '@/store';
import {
  FileImage,
  CheckCircle,
  XCircle,
  Download,
  Send,
  Clock,
} from 'lucide-react';
import clsx from 'clsx';
import { format, formatDistanceToNow } from 'date-fns';

interface Activity {
  id: string;
  type: 'created' | 'approved' | 'rejected' | 'exported' | 'submitted';
  title: string;
  description: string;
  timestamp: string;
  user?: string;
}

const activityIcons: Record<string, { icon: React.ReactNode; color: string }> = {
  created: {
    icon: <FileImage className="w-4 h-4" />,
    color: 'bg-proximo-gold text-white',
  },
  approved: {
    icon: <CheckCircle className="w-4 h-4" />,
    color: 'bg-green-500 text-white',
  },
  rejected: {
    icon: <XCircle className="w-4 h-4" />,
    color: 'bg-red-500 text-white',
  },
  exported: {
    icon: <Download className="w-4 h-4" />,
    color: 'bg-proximo-blue text-white',
  },
  submitted: {
    icon: <Send className="w-4 h-4" />,
    color: 'bg-purple-500 text-white',
  },
};

// Sample activity data
const sampleActivities: Activity[] = [
  {
    id: '1',
    type: 'approved',
    title: 'Jose Cuervo Shelf Talker',
    description: 'Approved by Brand Manager',
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    user: 'Maria Garcia',
  },
  {
    id: '2',
    type: 'exported',
    title: 'Kraken End Cap Display',
    description: 'Exported as PDF (300 DPI)',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
  },
  {
    id: '3',
    type: 'submitted',
    title: '1800 Tequila Digital Screen',
    description: 'Submitted for review - Total Wine',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
  },
  {
    id: '4',
    type: 'created',
    title: 'Three Olives Shelf Talker',
    description: 'New asset created from template',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
  },
  {
    id: '5',
    type: 'rejected',
    title: 'Jose Cuervo Floor Display',
    description: 'Revisions requested - Font size issue',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
    user: 'Brand Manager',
  },
];

export function RecentActivity() {
  return (
    <div className="card">
      <div className="px-6 py-4 border-b border-gray-100">
        <h3 className="font-display font-bold text-gray-900">Recent Activity</h3>
      </div>
      <div className="divide-y divide-gray-50">
        {sampleActivities.map((activity) => {
          const { icon, color } = activityIcons[activity.type];
          return (
            <div
              key={activity.id}
              className="px-6 py-4 flex items-start gap-4 hover:bg-gray-50 transition-colors"
            >
              <div
                className={clsx(
                  'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0',
                  color
                )}
              >
                {icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">
                  {activity.title}
                </p>
                <p className="text-sm text-gray-500 mt-0.5">
                  {activity.description}
                </p>
              </div>
              <div className="text-xs text-gray-400 flex-shrink-0">
                {formatDistanceToNow(new Date(activity.timestamp), {
                  addSuffix: true,
                })}
              </div>
            </div>
          );
        })}
      </div>
      <div className="px-6 py-3 border-t border-gray-100">
        <button className="text-sm text-proximo-gold hover:underline">
          View all activity
        </button>
      </div>
    </div>
  );
}
