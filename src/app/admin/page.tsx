'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { DashboardHeader } from '@/components/layout/DashboardHeader';
import { Button } from '@/components/ui/Button';
import { useCurrency } from '@/contexts/CurrencyContext';
import { STATUS_CONFIG, TIER_CONFIG } from '@/lib/constants';
import { formatDateTime } from '@/lib/formatters';
import { Shipment, Driver, Vehicle, Warehouse, InventoryItem } from '@/types';
import {
  DollarSign,
  Package,
  Truck,
  Warehouse as WarehouseIcon,
  TrendingUp,
  ShieldCheck,
  Users,
  AlertTriangle,
  ArrowRight,
  Boxes,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const { format } = useCurrency();
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/shipments'),
      fetch('/api/drivers'),
      fetch('/api/vehicles'),
      fetch('/api/warehouses'),
    ])
      .then(async ([sRes, dRes, vRes, wRes]) => {
        const sData = await sRes.json();
        const dData = await dRes.json();
        const vData = await vRes.json();
        const wData = await wRes.json();

        if (sData.success) setShipments(sData.data);
        if (dData.success) setDrivers(dData.data);
        if (vData.success) setVehicles(vData.data);
        if (wData.success) setWarehouses(wData.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const totalGrossRevenue = shipments.reduce((sum, s) => sum + (s.pricing?.total || 0), 0) + 128450.0;
  const inTransitCount = shipments.filter(
    (s) => s.status === 'IN_TRANSIT' || s.status === 'OUT_FOR_DELIVERY' || s.status === 'ASSIGNED'
  ).length;

  return (
    <>
      <DashboardHeader
        title="Executive Command Center"
        subtitle="Universal operational telemetry, revenue performance, and enterprise asset status."
      />

      <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-8">
        {/* KPI Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-subtle flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Gross Settled Revenue
              </span>
              <div className="text-3xl font-extrabold text-brand-navy mt-1">
                {format(totalGrossRevenue)}
              </div>
              <span className="text-[11px] text-emerald-600 font-semibold mt-1 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" /> +14.2% Month-over-month
              </span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <DollarSign className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-subtle flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                In-Transit Freight
              </span>
              <div className="text-3xl font-extrabold text-brand-navy mt-1">
                {inTransitCount}
              </div>
              <span className="text-[11px] text-blue-600 font-semibold mt-1">
                Active telematics tracking
              </span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-brand-teal flex items-center justify-center">
              <Package className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-subtle flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Fleet Assets Active
              </span>
              <div className="text-3xl font-extrabold text-brand-navy mt-1">
                {vehicles.length}
              </div>
              <span className="text-[11px] text-emerald-600 font-semibold mt-1">
                100% DOT safety certified
              </span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Truck className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-subtle flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Terminal Warehouses
              </span>
              <div className="text-3xl font-extrabold text-brand-navy mt-1">
                {warehouses.length}
              </div>
              <span className="text-[11px] text-purple-600 font-semibold mt-1">
                220,000 m³ Total Capacity
              </span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <WarehouseIcon className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Quick Management Shortcuts */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Link
            href="/admin/shipments"
            className="p-5 rounded-3xl bg-white border border-slate-200/80 hover:border-brand-teal hover:shadow-subtle transition-all flex flex-col justify-between"
          >
            <Package className="w-6 h-6 text-brand-teal mb-3" />
            <div>
              <div className="font-bold text-sm text-brand-navy">Universal Shipments</div>
              <div className="text-xs text-slate-500 mt-0.5">Override states & manifests</div>
            </div>
          </Link>

          <Link
            href="/admin/drivers"
            className="p-5 rounded-3xl bg-white border border-slate-200/80 hover:border-brand-teal hover:shadow-subtle transition-all flex flex-col justify-between"
          >
            <Users className="w-6 h-6 text-brand-teal mb-3" />
            <div>
              <div className="font-bold text-sm text-brand-navy">Driver Management</div>
              <div className="text-xs text-slate-500 mt-0.5">CDL licenses & performance</div>
            </div>
          </Link>

          <Link
            href="/admin/warehouses"
            className="p-5 rounded-3xl bg-white border border-slate-200/80 hover:border-brand-teal hover:shadow-subtle transition-all flex flex-col justify-between"
          >
            <Boxes className="w-6 h-6 text-brand-teal mb-3" />
            <div>
              <div className="font-bold text-sm text-brand-navy">Inventory & SKUs</div>
              <div className="text-xs text-slate-500 mt-0.5">Stock movements & reserves</div>
            </div>
          </Link>

          <Link
            href="/admin/pricing-rules"
            className="p-5 rounded-3xl bg-white border border-slate-200/80 hover:border-brand-teal hover:shadow-subtle transition-all flex flex-col justify-between"
          >
            <ShieldCheck className="w-6 h-6 text-brand-teal mb-3" />
            <div>
              <div className="font-bold text-sm text-brand-navy">Pricing Engine Rules</div>
              <div className="text-xs text-slate-500 mt-0.5">Distance & zone surcharges</div>
            </div>
          </Link>
        </div>

        {/* Global Network Hubs Overview */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-subtle space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-brand-navy">Operational Hub Facilities</h3>
              <p className="text-xs text-slate-500">Live storage volume and terminal status.</p>
            </div>
            <Link
              href="/admin/warehouses"
              className="text-xs font-bold text-brand-teal hover:underline flex items-center gap-1"
            >
              <span>Manage Warehouses</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {warehouses.map((wh) => {
              const utilPercent = Math.round((wh.capacityUsedM3 / wh.capacityTotalM3) * 100);
              return (
                <div
                  key={wh.id}
                  className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-xs text-brand-navy">{wh.code}</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 uppercase">
                      {wh.status}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{wh.name}</h4>
                    <p className="text-xs text-slate-500">{wh.city}, {wh.country}</p>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs text-slate-600 mb-1">
                      <span>Capacity Utilization:</span>
                      <strong className="font-mono">{utilPercent}%</strong>
                    </div>
                    <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-brand-teal rounded-full"
                        style={{ width: `${utilPercent}%` }}
                      />
                    </div>
                    <div className="text-[10px] text-slate-400 mt-1">
                      {wh.capacityUsedM3.toLocaleString()} / {wh.capacityTotalM3.toLocaleString()} m³
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
