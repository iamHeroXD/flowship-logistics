'use client';

import React from 'react';
import { DriverNav } from '@/components/layout/DriverNav';

export default function DriverLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col pb-20">
      {children}
      <DriverNav />
    </div>
  );
}
