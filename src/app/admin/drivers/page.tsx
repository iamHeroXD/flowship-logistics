'use client';

import React, { useState, useEffect } from 'react';
import { DashboardHeader } from '@/components/layout/DashboardHeader';
import { Button } from '@/components/ui/Button';
import { Driver, DriverStatus } from '@/types';
import { useToast } from '@/contexts/ToastContext';
import { Users, Truck, Star, Phone, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function AdminDriversPage() {
  const { success, error } = useToast();
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDrivers = () => {
    fetch('/api/drivers')
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setDrivers(d.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchDrivers();
  }, []);

  const handleStatusChange = async (driverId: string, newStatus: DriverStatus) => {
    try {
      const res = await fetch('/api/drivers', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: driverId, status: newStatus }),
      });
      if (res.ok) {
        success(`Driver status set to ${newStatus}`);
        fetchDrivers();
      }
    } catch {
      error('Failed to update driver status.');
    }
  };

  return (
    <>
      <DashboardHeader
        title="Fleet Drivers & Couriers Roster"
        subtitle="Manage certified commercial drivers, monitor live duty statuses, and inspect ratings."
      />

      <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-6">
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-subtle overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-brand-navy">Active Driver Fleet</h2>
              <p className="text-xs text-slate-500">{drivers.length} commercial drivers registered in the network.</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[11px] font-bold border-b border-slate-100">
                <tr>
                  <th className="py-3.5 px-6">Driver Identity</th>
                  <th className="py-3.5 px-6">CDL License #</th>
                  <th className="py-3.5 px-6">Assigned Vehicle</th>
                  <th className="py-3.5 px-6">Rating & Deliveries</th>
                  <th className="py-3.5 px-6">Live Status</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {drivers.map((drv) => (
                  <tr key={drv.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-brand-teal text-white flex items-center justify-center font-bold text-xs">
                          {drv.name.split(' ').map((n) => n[0]).join('')}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900">{drv.name}</div>
                          <div className="text-[11px] text-slate-400">{drv.phone}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 font-mono font-semibold text-slate-700">
                      {drv.licenseNumber}
                    </td>
                    <td className="py-4 px-6 font-mono text-slate-600">
                      {drv.assignedVehicleId || 'Electric Van'}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-1 font-bold text-brand-navy">
                        <span>{drv.rating}</span>
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span className="text-[11px] text-slate-400 font-normal ml-1">
                          ({drv.totalDeliveries} runs)
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase border ${
                          drv.status === 'AVAILABLE'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : drv.status === 'BUSY'
                            ? 'bg-amber-50 text-amber-800 border-amber-200'
                            : 'bg-slate-100 text-slate-600 border-slate-200'
                        }`}
                      >
                        {drv.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            handleStatusChange(
                              drv.id,
                              drv.status === 'AVAILABLE' ? 'OFFLINE' : 'AVAILABLE'
                            )
                          }
                        >
                          Toggle {drv.status === 'AVAILABLE' ? 'Offline' : 'Available'}
                        </Button>
                      </div>
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
