'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useStore } from '@/store';
import {
  LayoutDashboard,
  FileImage,
  Library,
  FolderOpen,
  Settings,
  Bell,
  LogOut,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Clock,
} from 'lucide-react';
import clsx from 'clsx';

const navItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/templates', label: 'Templates', icon: FileImage },
  { href: '/assets', label: 'My Assets', icon: FolderOpen },
  { href: '/library', label: 'Asset Library', icon: Library },
  { href: '/approvals', label: 'Approvals', icon: CheckCircle },
];

export function Sidebar() {
  const pathname = usePathname();
  const { currentUser, notifications, sidebarOpen, setSidebarOpen } = useStore();
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <aside
      className={clsx(
        'fixed left-0 top-0 h-screen bg-white border-r border-gray-200 transition-all duration-300 z-40',
        sidebarOpen ? 'w-64' : 'w-20'
      )}
    >
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-100">
          {sidebarOpen ? (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-proximo-gold rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">P</span>
              </div>
              <div>
                <span className="font-display font-bold text-proximo-dark">Brand</span>
                <span className="font-display font-bold text-proximo-gold">Muscle</span>
              </div>
            </div>
          ) : (
            <div className="w-8 h-8 bg-proximo-gold rounded-lg flex items-center justify-center mx-auto">
              <span className="text-white font-bold text-sm">P</span>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {sidebarOpen ? (
              <ChevronLeft className="w-5 h-5 text-gray-500" />
            ) : (
              <ChevronRight className="w-5 h-5 text-gray-500" />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200',
                  isActive
                    ? 'bg-proximo-gold/10 text-proximo-gold font-medium'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                )}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {sidebarOpen && <span>{item.label}</span>}
                {item.href === '/approvals' && unreadCount > 0 && sidebarOpen && (
                  <span className="ml-auto bg-proximo-red text-white text-xs px-2 py-0.5 rounded-full">
                    {unreadCount}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Quick Stats */}
        {sidebarOpen && (
          <div className="px-4 py-3 border-t border-gray-100">
            <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
              Quick Stats
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Pending Review</span>
                <span className="font-medium text-proximo-gold">3</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">This Week</span>
                <span className="font-medium text-green-600">12</span>
              </div>
            </div>
          </div>
        )}

        {/* User section */}
        <div className="border-t border-gray-100 p-4">
          {sidebarOpen ? (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-proximo-gold/20 rounded-full flex items-center justify-center">
                <span className="text-proximo-gold font-medium">
                  {currentUser?.name.charAt(0)}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {currentUser?.name}
                </p>
                <p className="text-xs text-gray-500 capitalize">
                  {currentUser?.role.replace('_', ' ')}
                </p>
              </div>
              <button className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
                <Settings className="w-4 h-4 text-gray-500" />
              </button>
            </div>
          ) : (
            <div className="flex justify-center">
              <div className="w-10 h-10 bg-proximo-gold/20 rounded-full flex items-center justify-center">
                <span className="text-proximo-gold font-medium">
                  {currentUser?.name.charAt(0)}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
