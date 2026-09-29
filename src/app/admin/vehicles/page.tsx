'use client';

import React, { useState, useEffect } from 'react';
import { DashboardHeader } from '@/components/layout/DashboardHeader';
import { Vehicle } from '@/types';
import { formatDate } from '@/lib/formatters';
import { Truck, ShieldCheck, Wrench, AlertTriangle } from 'lucide-react';

export default function AdminVehiclesPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);

  useEffect(() => {
    fetch('/api/vehicles')
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setVehicles(d.data);
      })
      .catch(() => {});
  }, []);

  return (
    <>
      <DashboardHeader
        title="Fleet Vehicle Registry & Maintenance"
        subtitle="Manage physical assets, payload capacities, telemetry integrations, and inspection cycles."
      />

      <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-6">
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-subtle overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-brand-navy">Registered Fleet Units</h2>
              <p className="text-xs text-slate-500">{vehicles.length} commercial vehicles in operational service.</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[11px] font-bold border-b border-slate-100">
                <tr>
                  <th className="py-3.5 px-6">Plate & Model</th>
                  <th className="py-3.5 px-6">Asset Type</th>
                  <th className="py-3.5 px-6">Max Weight / Volume</th>
                  <th className="py-3.5 px-6">Odometer Mileage</th>
                  <th className="py-3.5 px-6">Last Service</th>
                  <th className="py-3.5 px-6">Inspection Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {vehicles.map((v) => (
                  <tr key={v.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-4 px-6">
                      <div className="font-mono font-bold text-slate-900">{v.plateNumber}</div>
                      <div className="text-xs text-slate-500">{v.model}</div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-xs font-bold text-brand-teal bg-brand-surface px-2.5 py-1 rounded-full border border-slate-200">
                        {v.type.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="py-4 px-6 font-mono text-slate-700">
                      <strong>{v.maxWeightCapacityKg.toLocaleString()} kg</strong> &bull; {v.maxVolumeCapacityM3} m³
                    </td>
                    <td className="py-4 px-6 font-mono text-slate-600">
                      {v.mileageKm.toLocaleString()} km
                    </td>
                    <td className="py-4 px-6 text-slate-500 text-xs">
                      {formatDate(v.lastMaintenanceDate)}
                    </td>
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-50 text-emerald-800 border border-emerald-200">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Certified Active</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
