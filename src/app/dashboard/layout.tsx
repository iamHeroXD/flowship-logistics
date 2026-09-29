'use client';

import React from 'react';
import { DashboardSidebar } from '@/components/layout/DashboardSidebar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex-1 flex min-h-screen bg-slate-50/60">
      <DashboardSidebar />
      <div className="flex-1 flex flex-col overflow-y-auto min-w-0">
        {children}
      </div>
    </div>
  );
}
