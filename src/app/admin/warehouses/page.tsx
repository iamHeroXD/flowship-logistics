'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { DashboardHeader } from '@/components/layout/DashboardHeader';
import { Warehouse } from '@/types';
import { Warehouse as WarehouseIcon, MapPin, Boxes, ArrowRight, ShieldCheck } from 'lucide-react';

export default function AdminWarehousesPage() {
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);

  useEffect(() => {
    fetch('/api/warehouses')
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setWarehouses(d.data);
      })
      .catch(() => {});
  }, []);

  return (
    <>
      <DashboardHeader
        title="Multi-City Warehouse Network"
        subtitle="Intermodal logistics terminals, cross-docking hubs, and automated bonded fulfillment centers."
      />

      <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {warehouses.map((wh) => {
            const util = Math.round((wh.capacityUsedM3 / wh.capacityTotalM3) * 100);
            return (
              <div
                key={wh.id}
                className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-subtle space-y-4 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-mono text-xs font-bold text-brand-teal bg-brand-surface px-3 py-1 rounded-full border border-slate-200">
                      {wh.code}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200">
                      {wh.status}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-brand-navy mb-1">{wh.name}</h3>
                  <p className="text-xs text-slate-500 mb-4">{wh.address}</p>

                  <div className="space-y-1.5 pt-3 border-t border-slate-100 text-xs text-slate-600">
                    <div className="flex justify-between">
                      <span>Hub Manager:</span>
                      <strong className="text-slate-900">{wh.managerName}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Capacity Utilization:</span>
                      <strong className="font-mono">{util}%</strong>
                    </div>
                  </div>

                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mt-3">
                    <div
                      className="h-full bg-brand-teal rounded-full"
                      style={{ width: `${util}%` }}
                    />
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1">
                    {wh.capacityUsedM3.toLocaleString()} m³ / {wh.capacityTotalM3.toLocaleString()} m³
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                  <Link
                    href={`/admin/inventory?warehouse=${wh.code}`}
                    className="font-bold text-brand-teal hover:underline flex items-center gap-1"
                  >
                    <span>Inspect SKU Inventory</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
