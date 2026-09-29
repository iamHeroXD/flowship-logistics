'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { DashboardHeader } from '@/components/layout/DashboardHeader';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useCurrency } from '@/contexts/CurrencyContext';
import { STATUS_CONFIG, TIER_CONFIG } from '@/lib/constants';
import { formatDateTime } from '@/lib/formatters';
import { Shipment, ShipmentStatus } from '@/types';
import {
  Package,
  Search,
  Filter,
  PlusCircle,
  FileSpreadsheet,
  ChevronRight,
  MapPin,
  Clock,
} from 'lucide-react';

export default function ShipmentsListPage() {
  const { format } = useCurrency();
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/shipments')
      .then((res) => res.json())
      .then((d) => {
        if (d.success && Array.isArray(d.data)) {
          setShipments(d.data);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const filtered = shipments.filter((shp) => {
    const matchesSearch =
      shp.trackingNumber.toLowerCase().includes(search.toLowerCase()) ||
      shp.origin.city.toLowerCase().includes(search.toLowerCase()) ||
      shp.destination.city.toLowerCase().includes(search.toLowerCase()) ||
      shp.package.description.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || shp.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const statusTabs = [
    { id: 'ALL', label: 'All Orders' },
    { id: 'PENDING', label: 'Pending' },
    { id: 'IN_TRANSIT', label: 'In Transit' },
    { id: 'OUT_FOR_DELIVERY', label: 'Out for Delivery' },
    { id: 'DELIVERED', label: 'Delivered' },
  ];

  return (
    <>
      <DashboardHeader
        title="Freight Shipments Ledger"
        subtitle="Universal listing of all active, scheduled, and completed consignments."
      />

      <div className="p-6 sm:p-8 space-y-6 max-w-7xl">
        {/* Top Controls Bar */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-subtle flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="w-full md:w-96">
            <Input
              placeholder="Search tracking #, city, or contents..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              leftIcon={<Search className="w-4 h-4 text-slate-400" />}
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
            <Link href="/dashboard/shipments/bulk">
              <Button variant="outline" size="sm" leftIcon={<FileSpreadsheet className="w-4 h-4" />}>
                Bulk Upload
              </Button>
            </Link>
            <Link href="/dashboard/shipments/new">
              <Button variant="pill-primary" size="sm" leftIcon={<PlusCircle className="w-4 h-4" />}>
                Create Shipment
              </Button>
            </Link>
          </div>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {statusTabs.map((tab) => {
            const isSelected = statusFilter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id)}
                className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-brand-navy text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/70'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Table */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-subtle overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[11px] font-bold border-b border-slate-100">
                <tr>
                  <th className="py-3.5 px-6">Tracking Number</th>
                  <th className="py-3.5 px-6">Origin &rarr; Destination</th>
                  <th className="py-3.5 px-6">Service Level</th>
                  <th className="py-3.5 px-6">Weight</th>
                  <th className="py-3.5 px-6">Status</th>
                  <th className="py-3.5 px-6 text-right">Fee</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {filtered.map((shp) => {
                  const statusConf = STATUS_CONFIG[shp.status] || STATUS_CONFIG.PENDING;
                  return (
                    <tr key={shp.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-4 px-6 font-mono font-bold text-brand-navy">
                        <Link
                          href={`/dashboard/shipments/${shp.id}`}
                          className="hover:text-brand-teal transition-colors"
                        >
                          {shp.trackingNumber}
                        </Link>
                        <div className="text-[11px] font-normal text-slate-400">
                          {formatDateTime(shp.createdAt)}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="text-slate-900 font-semibold">
                          {shp.origin.city} &rarr; {shp.destination.city}
                        </div>
                        <div className="text-[11px] text-slate-400 truncate max-w-xs">
                          {shp.package.description}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-xs text-slate-700 font-semibold">
                          {TIER_CONFIG[shp.deliveryTier]?.label}
                        </span>
                      </td>
                      <td className="py-4 px-6 font-mono">
                        {shp.package.weightKg} kg
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border uppercase tracking-wider ${statusConf.bg} ${statusConf.text} ${statusConf.border}`}
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-current" />
                          <span>{statusConf.label}</span>
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right font-bold text-slate-900">
                        {format(shp.pricing?.total || 0)}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/dashboard/shipments/${shp.id}`}
                            className="text-xs font-bold text-brand-teal hover:underline"
                          >
                            Details
                          </Link>
                          <Link
                            href={`/tracking?id=${shp.trackingNumber}`}
                            className="p-1 text-slate-400 hover:text-slate-600 rounded"
                            title="Open in tracking telemetry"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {filtered.length === 0 && (
              <div className="p-12 text-center text-slate-400 text-sm">
                No shipments found matching &ldquo;{search}&rdquo;.
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
