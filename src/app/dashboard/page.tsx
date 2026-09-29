'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { DashboardHeader } from '@/components/layout/DashboardHeader';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/contexts/AuthContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import { STATUS_CONFIG, TIER_CONFIG } from '@/lib/constants';
import { formatDateTime } from '@/lib/formatters';
import { Shipment } from '@/types';
import {
  Package,
  Clock,
  CheckCircle2,
  DollarSign,
  PlusCircle,
  FileSpreadsheet,
  ArrowRight,
  TrendingUp,
  MapPin,
  ChevronRight,
} from 'lucide-react';

export default function CustomerDashboardPage() {
  const { user } = useAuth();
  const { format } = useCurrency();
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/shipments?customerId=usr_cust_1')
      .then((res) => res.json())
      .then((d) => {
        if (d.success && Array.isArray(d.data)) {
          setShipments(d.data);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const inTransitCount = shipments.filter(
    (s) => s.status === 'IN_TRANSIT' || s.status === 'OUT_FOR_DELIVERY' || s.status === 'ASSIGNED'
  ).length;
  const pendingCount = shipments.filter((s) => s.status === 'PENDING').length;
  const deliveredCount = shipments.filter((s) => s.status === 'DELIVERED').length;
  const totalSpend = shipments.reduce((sum, s) => sum + (s.pricing?.total || 0), 0);

  return (
    <>
      <DashboardHeader
        title={`Welcome back, ${user?.name || 'Elena'}`}
        subtitle="Manage your outgoing orders, track in-transit linehauls, and inspect POD receipts."
      />

      <div className="p-6 sm:p-8 space-y-8 max-w-7xl">
        {/* KPI Cards Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-subtle flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                In Transit & Out
              </span>
              <div className="text-3xl font-extrabold text-brand-navy mt-1">{inTransitCount}</div>
              <span className="text-[11px] text-emerald-600 font-medium mt-1 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" /> Real-time active
              </span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-brand-teal flex items-center justify-center">
              <Package className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-subtle flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Pending Dispatch
              </span>
              <div className="text-3xl font-extrabold text-brand-navy mt-1">{pendingCount}</div>
              <span className="text-[11px] text-amber-600 font-medium mt-1">Awaiting driver assignment</span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-subtle flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Delivered & Signed
              </span>
              <div className="text-3xl font-extrabold text-brand-navy mt-1">{deliveredCount}</div>
              <span className="text-[11px] text-emerald-600 font-medium mt-1">POD available</span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-brand-mint flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-subtle flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Total Freight Spend
              </span>
              <div className="text-3xl font-extrabold text-brand-navy mt-1">{format(totalSpend)}</div>
              <span className="text-[11px] text-slate-500 font-medium mt-1">Settled & Invoiced</span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-brand-surface text-brand-navy flex items-center justify-center">
              <DollarSign className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Quick Actions Banner */}
        <div className="bg-brand-navy text-white rounded-3xl p-6 sm:p-8 shadow-elevated flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-xl font-bold mb-1">Dispatching freight today?</h2>
            <p className="text-sm text-slate-300 max-w-lg">
              Book a single urgent express parcel or upload hundreds of orders at once using our batch CSV processor.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link href="/dashboard/shipments/new">
              <Button variant="pill-primary" className="bg-emerald-500 hover:bg-emerald-600 text-brand-navy font-bold">
                <PlusCircle className="w-4 h-4 mr-1.5" />
                Book Single Shipment
              </Button>
            </Link>
            <Link href="/dashboard/shipments/bulk">
              <Button variant="pill-secondary" className="bg-slate-800 text-white border-slate-700 hover:bg-slate-700">
                <FileSpreadsheet className="w-4 h-4 mr-1.5" />
                Upload CSV Batch
              </Button>
            </Link>
          </div>
        </div>

        {/* Recent Shipments Table */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-subtle overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-brand-navy">Active & Recent Shipments</h3>
              <p className="text-xs text-slate-500">Real-time status updates and telemetry tracking.</p>
            </div>
            <Link
              href="/dashboard/shipments"
              className="text-xs font-bold text-brand-teal hover:underline flex items-center gap-1"
            >
              <span>View All Shipments</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[11px] font-bold border-b border-slate-100">
                <tr>
                  <th className="py-3.5 px-6">Tracking Number</th>
                  <th className="py-3.5 px-6">Origin &rarr; Destination</th>
                  <th className="py-3.5 px-6">Tier</th>
                  <th className="py-3.5 px-6">Status</th>
                  <th className="py-3.5 px-6 text-right">Fee</th>
                  <th className="py-3.5 px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {shipments.slice(0, 5).map((shp) => {
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
                        <div className="text-slate-900 font-semibold">{shp.origin.city} &rarr; {shp.destination.city}</div>
                        <div className="text-[11px] text-slate-400 truncate max-w-xs">{shp.package.description}</div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-xs text-slate-700 font-semibold">
                          {TIER_CONFIG[shp.deliveryTier]?.label}
                        </span>
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
                        <Link
                          href={`/dashboard/shipments/${shp.id}`}
                          className="inline-flex items-center gap-1 text-xs font-bold text-brand-teal hover:text-brand-teal-hover p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
                        >
                          <span>Details</span>
                          <ChevronRight className="w-4 h-4" />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
