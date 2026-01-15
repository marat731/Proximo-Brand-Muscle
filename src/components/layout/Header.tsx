'use client';

import React, { useState } from 'react';
import { useStore } from '@/store';
import {
  Search,
  Bell,
  Filter,
  Plus,
} from 'lucide-react';
import clsx from 'clsx';

interface HeaderProps {
  title: string;
  subtitle?: string;
  showSearch?: boolean;
  showFilters?: boolean;
  onSearch?: (query: string) => void;
  actions?: React.ReactNode;
}

export function Header({
  title,
  subtitle,
  showSearch = false,
  showFilters = false,
  onSearch,
  actions,
}: HeaderProps) {
  const { notifications, markNotificationRead, sidebarOpen } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);

  const unreadNotifications = notifications.filter((n) => !n.read);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch?.(query);
  };

  return (
    <header className="sticky top-0 z-30 bg-proximo-cream/80 backdrop-blur-sm border-b border-gray-200">
      <div className="flex items-center justify-between h-16 px-6">
        {/* Title */}
        <div>
          <h1 className="text-xl font-display font-bold text-proximo-dark">
            {title}
          </h1>
          {subtitle && (
            <p className="text-sm text-gray-500">{subtitle}</p>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          {/* Search */}
          {showSearch && (
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search templates..."
                value={searchQuery}
                onChange={handleSearch}
                className="w-64 pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg
                         focus:outline-none focus:ring-2 focus:ring-proximo-gold focus:border-transparent
                         placeholder-gray-400 text-sm"
              />
            </div>
          )}

          {/* Filters */}
          {showFilters && (
            <button className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg hover:border-proximo-gold transition-colors">
              <Filter className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">Filters</span>
            </button>
          )}

          {/* Custom Actions */}
          {actions}

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 hover:bg-white rounded-lg transition-colors"
            >
              <Bell className="w-5 h-5 text-gray-600" />
              {unreadNotifications.length > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-proximo-red rounded-full" />
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden animate-fadeIn">
                <div className="px-4 py-3 border-b border-gray-100">
                  <h3 className="font-medium text-gray-900">Notifications</h3>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="px-4 py-8 text-center text-gray-500 text-sm">
                      No notifications
                    </div>
                  ) : (
                    notifications.slice(0, 5).map((notification) => (
                      <button
                        key={notification.id}
                        onClick={() => markNotificationRead(notification.id)}
                        className={clsx(
                          'w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors border-b border-gray-50',
                          !notification.read && 'bg-proximo-gold/5'
                        )}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={clsx(
                              'w-2 h-2 rounded-full mt-2 flex-shrink-0',
                              notification.read ? 'bg-gray-300' : 'bg-proximo-gold'
                            )}
                          />
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {notification.title}
                            </p>
                            <p className="text-xs text-gray-500 mt-0.5">
                              {notification.message}
                            </p>
                          </div>
                        </div>
                      </button>
                    ))
                  )}
                </div>
                <div className="px-4 py-2 border-t border-gray-100">
                  <button className="text-sm text-proximo-gold hover:underline">
                    View all notifications
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
