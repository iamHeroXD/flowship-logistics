'use client';

import React, { useState, useEffect } from 'react';
import { DashboardHeader } from '@/components/layout/DashboardHeader';
import { InteractiveMap } from '@/components/shared/InteractiveMap';
import { Driver, Shipment } from '@/types';
import { Navigation, Users, MapPin, Truck } from 'lucide-react';

export default function DispatcherLiveMapPage() {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [shipments, setShipments] = useState<Shipment[]>([]);

  useEffect(() => {
    Promise.all([fetch('/api/drivers'), fetch('/api/shipments')])
      .then(async ([dRes, sRes]) => {
        const dData = await dRes.json();
        const sData = await sRes.json();
        if (dData.success) setDrivers(dData.data);
        if (sData.success) setShipments(sData.data);
      })
      .catch(() => {});
  }, []);

  return (
    <>
      <DashboardHeader
        title="Fleet Telematics Radar"
        subtitle="Live geographic coordinates of active couriers and in-transit delivery corridors."
      />

      <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-6">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-subtle">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-base font-bold text-brand-navy flex items-center gap-2">
                <Navigation className="w-5 h-5 text-brand-teal" />
                <span>Metropolitan Fleet Telemetry</span>
              </h2>
              <p className="text-xs text-slate-500">
                Tracking {drivers.length} registered vehicles across metropolitan transit zones.
              </p>
            </div>

            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1 text-emerald-700 font-semibold bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Live Satellites Locked
              </span>
            </div>
          </div>

          <InteractiveMap
            height="520px"
            origin={{ lat: 40.7128, lng: -74.006, label: 'New York Metro Logistics Terminal' }}
            destination={{ lat: 40.7589, lng: -73.9851, label: 'Midtown Hub' }}
            currentLocation={{ lat: 40.7306, lng: -73.9352, label: 'Carlos Mendoza (FS-982-NY)' }}
          />
        </div>

        {/* Live Drivers Coordinates Table */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-subtle overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <h3 className="text-base font-bold text-brand-navy">GPS Position Telemetry Log</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-100">
                <tr>
                  <th className="py-3 px-6">Driver & Unit</th>
                  <th className="py-3 px-6">Status</th>
                  <th className="py-3 px-6 font-mono">Latitude / Longitude</th>
                  <th className="py-3 px-6">Active Deliveries</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {drivers.map((d) => (
                  <tr key={d.id} className="hover:bg-slate-50">
                    <td className="py-3.5 px-6 font-semibold text-slate-900">
                      {d.name} <span className="font-mono text-slate-400 font-normal">({d.assignedVehicleId || 'Van'})</span>
                    </td>
                    <td className="py-3.5 px-6">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 uppercase">
                        {d.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-6 font-mono text-slate-600">
                      {d.currentLocation.lat.toFixed(4)}, {d.currentLocation.lng.toFixed(4)}
                    </td>
                    <td className="py-3.5 px-6 text-slate-700 font-bold">
                      {d.activeShipmentIds.length} Consignments
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
