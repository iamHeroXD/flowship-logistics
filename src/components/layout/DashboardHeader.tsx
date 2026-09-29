'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import { Bell, Search, DollarSign, Plus } from 'lucide-react';
import { CurrencyCode } from '@/lib/formatters';
import { NotificationItem } from '@/types';

export const DashboardHeader: React.FC<{ title?: string; subtitle?: string }> = ({
  title = 'Operations Portal',
  subtitle,
}) => {
  const { user } = useAuth();
  const { currency, setCurrency } = useCurrency();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (user?.id) {
      fetch(`/api/notifications?userId=${user.id}`)
        .then((r) => r.json())
        .then((d) => {
          if (d.success && Array.isArray(d.data)) {
            setUnreadCount(d.data.filter((n: NotificationItem) => !n.read).length);
          }
        })
        .catch(() => {});
    }
  }, [user?.id]);

  return (
    <header className="h-16 bg-white border-b border-slate-200/80 px-6 sm:px-8 flex items-center justify-between shrink-0">
      <div>
        <h1 className="text-lg font-bold text-brand-navy tracking-tight">{title}</h1>
        {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-3">
        {/* Currency Switcher */}
        <div className="relative inline-flex items-center text-xs text-slate-500 bg-slate-50 rounded-lg px-2 py-1 border border-slate-200">
          <DollarSign className="w-3.5 h-3.5 text-slate-400 mr-0.5" />
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
            className="bg-transparent text-slate-700 font-semibold focus:outline-none cursor-pointer"
            aria-label="Currency"
          >
            <option value="USD">USD ($)</option>
            <option value="EUR">EUR (€)</option>
            <option value="GBP">GBP (£)</option>
            <option value="NGN">NGN (₦)</option>
            <option value="INR">INR (₹)</option>
          </select>
        </div>

        {/* Notifications Icon with Badge */}
        <Link
          href="/dashboard/notifications"
          className="relative p-2 rounded-xl text-slate-600 hover:text-brand-navy hover:bg-slate-100 transition-colors"
          aria-label="View notifications"
        >
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white" />
          )}
        </Link>

        {/* Quick New Shipment Button (for Customers) */}
        {user?.role === 'CUSTOMER' && (
          <Link
            href="/dashboard/shipments/new"
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-brand-teal text-white text-xs font-semibold hover:bg-brand-teal-hover transition-colors shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Shipment</span>
          </Link>
        )}
      </div>
    </header>
  );
};
