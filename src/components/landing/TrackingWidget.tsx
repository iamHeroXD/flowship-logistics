'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Package, Search, Clock, CheckCircle2, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { STATUS_CONFIG } from '@/lib/constants';
import { ShipmentStatus } from '@/types';

export const TrackingWidget: React.FC = () => {
  const router = useRouter();
  const [trackingNumber, setTrackingNumber] = useState('FLW-2026-89421');
  const [status, setStatus] = useState<ShipmentStatus>('IN_TRANSIT');
  const [routeBadge, setRouteBadge] = useState('NYC → LAX');
  const [lastUpdated, setLastUpdated] = useState('4 min ago');
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingNumber.trim()) return;

    setIsSearching(true);
    // Instant live lookup or navigate to full tracking page
    setTimeout(() => {
      setIsSearching(false);
      router.push(`/tracking?id=${encodeURIComponent(trackingNumber.trim())}`);
    }, 400);
  };

  const statusInfo = STATUS_CONFIG[status] || STATUS_CONFIG.IN_TRANSIT;

  return (
    <div className="w-full max-w-lg bg-white rounded-[28px] p-6 sm:p-8 shadow-elevated border border-slate-100 transition-all hover:shadow-2xl">
      {/* Title with icon matching screenshot */}
      <div className="flex items-center gap-2 text-brand-navy font-semibold text-base mb-5">
        <Package className="w-5 h-5 text-brand-mint" />
        <span>Track your shipment</span>
      </div>

      {/* Search Input Box */}
      <form onSubmit={handleSearch} className="relative flex items-center mb-6">
        <input
          type="text"
          value={trackingNumber}
          onChange={(e) => setTrackingNumber(e.target.value)}
          placeholder="Enter tracking number"
          className="w-full bg-slate-50/70 border border-slate-200/90 text-slate-800 text-sm rounded-full pl-5 pr-14 py-3.5 focus:outline-none focus:border-brand-teal focus:bg-white focus:ring-2 focus:ring-brand-teal/20 transition-all placeholder:text-slate-400 font-mono"
        />
        <button
          type="submit"
          disabled={isSearching}
          className="absolute right-1.5 w-11 h-11 rounded-full bg-brand-navy text-white flex items-center justify-center hover:bg-brand-teal transition-all shadow-xs disabled:opacity-50"
          aria-label="Search Tracking Number"
        >
          {isSearching ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Search className="w-4 h-4 text-white" />
          )}
        </button>
      </form>

      {/* Progress Node Bar matching screenshot: Nodes connected by subtle track */}
      <div className="bg-brand-surface rounded-2xl p-4 mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5 sm:gap-3 flex-1 mr-4">
          <div className="w-3 h-3 rounded-full bg-brand-teal ring-4 ring-brand-teal/20 shrink-0" />
          <div className="h-0.5 flex-1 bg-brand-teal/50 rounded-full" />
          <div className="w-2.5 h-2.5 rounded-full bg-brand-teal shrink-0" />
          <div className="h-0.5 flex-1 bg-slate-200 rounded-full" />
          <div className="w-2.5 h-2.5 rounded-full bg-slate-300 shrink-0" />
          <div className="h-0.5 flex-1 bg-slate-200 rounded-full" />
          <div className="w-2.5 h-2.5 rounded-full bg-slate-300 shrink-0" />
        </div>
        <div className="px-3 py-1 bg-white rounded-full text-xs font-semibold text-slate-700 shadow-xs border border-slate-200/70 shrink-0">
          {routeBadge}
        </div>
      </div>

      {/* Footer Info matching screenshot */}
      <div className="flex items-center justify-between text-xs pt-1">
        <div className="flex items-center gap-1.5 text-slate-500 font-medium">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          <span>Updated {lastUpdated}</span>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold text-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>{statusInfo.label}</span>
        </div>
      </div>
    </div>
  );
};
