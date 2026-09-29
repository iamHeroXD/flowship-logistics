'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import {
  Truck,
  LayoutDashboard,
  Package,
  PlusCircle,
  FileSpreadsheet,
  Receipt,
  Wallet,
  Bell,
  Settings,
  Navigation,
  MapPin,
  Route,
  Users,
  ShieldCheck,
  Warehouse,
  Boxes,
  Building2,
  Sliders,
  BarChart3,
  History,
  LogOut,
} from 'lucide-react';

export const DashboardSidebar: React.FC = () => {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const role = user?.role || 'CUSTOMER';

  const customerLinks = [
    { label: 'Overview', href: '/dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { label: 'Shipments', href: '/dashboard/shipments', icon: <Package className="w-4 h-4" /> },
    { label: 'Book Shipment', href: '/dashboard/shipments/new', icon: <PlusCircle className="w-4 h-4" /> },
    { label: 'Bulk Orders (CSV)', href: '/dashboard/shipments/bulk', icon: <FileSpreadsheet className="w-4 h-4" /> },
    { label: 'Live Tracking', href: '/dashboard/tracking', icon: <MapPin className="w-4 h-4" /> },
    { label: 'Invoices', href: '/dashboard/invoices', icon: <Receipt className="w-4 h-4" /> },
    { label: 'Wallet & Billing', href: '/dashboard/payments', icon: <Wallet className="w-4 h-4" /> },
    { label: 'Notifications', href: '/dashboard/notifications', icon: <Bell className="w-4 h-4" /> },
    { label: 'Settings', href: '/dashboard/settings', icon: <Settings className="w-4 h-4" /> },
  ];

  const dispatcherLinks = [
    { label: 'Dispatch Board', href: '/dispatcher', icon: <Navigation className="w-4 h-4" /> },
    { label: 'Fleet Live Map', href: '/dispatcher/live-map', icon: <MapPin className="w-4 h-4" /> },
    { label: 'Route Sequencing', href: '/dispatcher/routes', icon: <Route className="w-4 h-4" /> },
    { label: 'Notifications', href: '/dashboard/notifications', icon: <Bell className="w-4 h-4" /> },
  ];

  const adminLinks = [
    { label: 'Command Center', href: '/admin', icon: <LayoutDashboard className="w-4 h-4" /> },
    { label: 'Universal Shipments', href: '/admin/shipments', icon: <Package className="w-4 h-4" /> },
    { label: 'Drivers Fleet', href: '/admin/drivers', icon: <Users className="w-4 h-4" /> },
    { label: 'Vehicles & Fleet', href: '/admin/vehicles', icon: <Truck className="w-4 h-4" /> },
    { label: 'Warehouses', href: '/admin/warehouses', icon: <Warehouse className="w-4 h-4" /> },
    { label: 'Inventory & SKUs', href: '/admin/inventory', icon: <Boxes className="w-4 h-4" /> },
    { label: 'B2B Accounts', href: '/admin/businesses', icon: <Building2 className="w-4 h-4" /> },
    { label: 'Pricing Rules', href: '/admin/pricing-rules', icon: <Sliders className="w-4 h-4" /> },
    { label: 'Reports & Analytics', href: '/admin/reports', icon: <BarChart3 className="w-4 h-4" /> },
    { label: 'Audit Trail', href: '/admin/audit-logs', icon: <History className="w-4 h-4" /> },
    { label: 'System Settings', href: '/admin/settings', icon: <Settings className="w-4 h-4" /> },
  ];

  const links =
    role === 'DISPATCHER'
      ? dispatcherLinks
      : role === 'ADMIN' || role === 'SUPER_ADMIN'
      ? adminLinks
      : customerLinks;

  return (
    <aside className="w-64 bg-white border-r border-slate-200/80 flex flex-col justify-between shrink-0 min-h-[calc(100vh-2.25rem)]">
      <div>
        {/* Brand Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-brand-surface flex items-center justify-center text-brand-mint border border-slate-200">
              <Truck className="w-5 h-5 text-brand-mint" />
            </div>
            <span className="font-extrabold text-brand-navy tracking-tight text-base">
              Flowship
            </span>
          </Link>
          <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-brand-surface text-brand-teal">
            {role.replace(/_/g, ' ')}
          </span>
        </div>

        {/* Navigation list */}
        <nav className="p-4 space-y-1">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all',
                  isActive
                    ? 'bg-brand-teal text-white shadow-xs'
                    : 'text-slate-600 hover:text-brand-navy hover:bg-slate-50'
                )}
              >
                <span className={cn(isActive ? 'text-white' : 'text-slate-400')}>{link.icon}</span>
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* User profile card & Logout */}
      <div className="p-4 border-t border-slate-100">
        <div className="flex items-center gap-3 p-2 rounded-xl bg-slate-50/70 border border-slate-100 mb-2">
          {user?.avatarUrl ? (
            <img src={user.avatarUrl} alt="" className="w-8 h-8 rounded-full object-cover" />
          ) : (
            <div className="w-8 h-8 rounded-full bg-brand-navy text-white flex items-center justify-center text-xs font-bold">
              {user?.name.charAt(0) || 'U'}
            </div>
          )}
          <div className="overflow-hidden">
            <div className="text-xs font-bold text-brand-navy truncate">{user?.name}</div>
            <div className="text-[10px] text-slate-400 truncate">{user?.email}</div>
          </div>
        </div>

        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 p-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};
