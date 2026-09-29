'use client';

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types';
import { ShieldCheck, UserCheck, Truck, Navigation, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export const RoleSwitcherBanner: React.FC = () => {
  const { user, switchRole } = useAuth();

  const roles: { role: UserRole; label: string; icon: React.ReactNode; path: string }[] = [
    { role: 'CUSTOMER', label: 'Customer', icon: <UserCheck className="w-3.5 h-3.5" />, path: '/dashboard' },
    { role: 'DISPATCHER', label: 'Dispatcher', icon: <Navigation className="w-3.5 h-3.5" />, path: '/dispatcher' },
    { role: 'DRIVER', label: 'Driver (Mobile)', icon: <Truck className="w-3.5 h-3.5" />, path: '/driver' },
    { role: 'ADMIN', label: 'Admin', icon: <ShieldCheck className="w-3.5 h-3.5" />, path: '/admin' },
    { role: 'SUPER_ADMIN', label: 'Super Admin', icon: <Users className="w-3.5 h-3.5" />, path: '/admin' },
  ];

  return (
    <div className="bg-brand-navy text-slate-200 text-xs py-1.5 px-4 flex flex-wrap items-center justify-between border-b border-slate-800 z-50">
      <div className="flex items-center gap-2 font-mono">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span className="text-slate-400">DEMO ROLE SWITCHER:</span>
        <span className="font-semibold text-white">{user?.name}</span>
        <span className="bg-brand-teal/80 text-[10px] px-1.5 py-0.5 rounded text-emerald-300 font-sans uppercase">
          {user?.role.replace(/_/g, ' ')}
        </span>
      </div>

      <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
        <span className="text-slate-400 hidden sm:inline mr-1 text-[11px]">Preview as:</span>
        {roles.map((r) => {
          const isActive = user?.role === r.role;
          return (
            <button
              key={r.role}
              onClick={() => switchRole(r.role)}
              className={cn(
                'inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium transition-all',
                isActive
                  ? 'bg-brand-teal text-white shadow-xs font-semibold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              )}
            >
              {r.icon}
              <span>{r.label}</span>
            </button>
          );
        })}
        {user && (
          <Link
            href={
              user.role === 'CUSTOMER'
                ? '/dashboard'
                : user.role === 'DRIVER'
                ? '/driver'
                : user.role === 'DISPATCHER'
                ? '/dispatcher'
                : '/admin'
            }
            className="ml-2 underline text-emerald-400 hover:text-emerald-300 text-[11px] font-medium"
          >
            Go to {user.role.replace(/_/g, ' ')} Portal &rarr;
          </Link>
        )}
      </div>
    </div>
  );
};
