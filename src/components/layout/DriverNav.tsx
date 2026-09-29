'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Truck, Navigation, History, User } from 'lucide-react';
import { cn } from '@/lib/utils';

export const DriverNav: React.FC = () => {
  const pathname = usePathname();

  const links = [
    { label: 'Active Route', href: '/driver', icon: <Navigation className="w-5 h-5" /> },
    { label: 'Deliveries', href: '/driver/history', icon: <History className="w-5 h-5" /> },
    { label: 'Vehicle & Profile', href: '/driver/profile', icon: <User className="w-5 h-5" /> },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-brand-navy border-t border-slate-800 px-6 py-2 flex items-center justify-around shadow-2xl">
      {links.map((link) => {
        const isActive = pathname === link.href;
        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              'flex flex-col items-center gap-1 py-1.5 px-3 rounded-xl transition-all',
              isActive ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-white'
            )}
          >
            {link.icon}
            <span className="text-[10px] tracking-wide uppercase">{link.label}</span>
          </Link>
        );
      })}
    </nav>
  );
};
