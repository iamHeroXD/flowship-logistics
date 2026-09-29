'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/contexts/ToastContext';
import { DriverStatus, Shipment } from '@/types';
import { STATUS_CONFIG, TIER_CONFIG } from '@/lib/constants';
import {
  Truck,
  Navigation,
  Phone,
  MapPin,
  Clock,
  CheckCircle2,
  Package,
  Power,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';

export default function DriverDashboardPage() {
  const { success, error } = useToast();
  const [status, setStatus] = useState<DriverStatus>('AVAILABLE');
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDriverShipments = () => {
    fetch('/api/shipments')
      .then((r) => r.json())
      .then((d) => {
        if (d.success && Array.isArray(d.data)) {
          // Show shipments assigned to Carlos Mendoza (drv_01) or pending in metro
          const driverShipments = d.data.filter(
            (s: Shipment) => s.driverId === 'drv_01' || s.status === 'IN_TRANSIT' || s.status === 'ASSIGNED'
          );
          setShipments(driverShipments);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchDriverShipments();
  }, []);

  const handleStatusToggle = async (newStatus: DriverStatus) => {
    setStatus(newStatus);
    try {
      await fetch('/api/drivers', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: 'drv_01', status: newStatus }),
      });
      success(`Duty status updated to ${newStatus}`);
    } catch {
      error('Failed to sync duty status.');
    }
  };

  const activeShipment = shipments.find(
    (s) => s.status === 'IN_TRANSIT' || s.status === 'ASSIGNED' || s.status === 'OUT_FOR_DELIVERY'
  ) || shipments[0];

  return (
    <div className="p-4 sm:p-6 max-w-lg mx-auto w-full space-y-6">
      {/* Top Cockpit Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-brand-teal text-white flex items-center justify-center font-bold text-lg border border-slate-700">
            CM
          </div>
          <div>
            <h1 className="text-base font-extrabold text-white">Carlos Mendoza</h1>
            <p className="text-xs text-slate-400 font-mono">Ford E-Transit &bull; FS-982-NY</p>
          </div>
        </div>

        {/* Status Dropdown/Toggle */}
        <div className="flex items-center gap-1.5 bg-slate-800 p-1 rounded-2xl border border-slate-700">
          {(['AVAILABLE', 'BUSY', 'OFFLINE'] as DriverStatus[]).map((st) => (
            <button
              key={st}
              onClick={() => handleStatusToggle(st)}
              className={`px-2.5 py-1 rounded-xl text-[10px] font-bold tracking-wider uppercase transition-all ${
                status === st
                  ? st === 'AVAILABLE'
                    ? 'bg-emerald-500 text-slate-950 font-black shadow-xs'
                    : st === 'BUSY'
                    ? 'bg-amber-500 text-slate-950 font-black shadow-xs'
                    : 'bg-slate-600 text-white font-black'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Quick Metrics Bar */}
      <div className="grid grid-cols-3 gap-3 text-center">
        <div className="bg-slate-800/80 p-3.5 rounded-2xl border border-slate-700/80">
          <div className="text-xl font-black text-white">4</div>
          <div className="text-[10px] text-slate-400 uppercase font-semibold mt-0.5">Stops Left</div>
        </div>
        <div className="bg-slate-800/80 p-3.5 rounded-2xl border border-slate-700/80">
          <div className="text-xl font-black text-emerald-400">12</div>
          <div className="text-[10px] text-slate-400 uppercase font-semibold mt-0.5">Completed</div>
        </div>
        <div className="bg-slate-800/80 p-3.5 rounded-2xl border border-slate-700/80">
          <div className="text-xl font-black text-emerald-400">$340</div>
          <div className="text-[10px] text-slate-400 uppercase font-semibold mt-0.5">Earnings</div>
        </div>
      </div>

      {/* Active High-Priority Delivery Card */}
      {activeShipment ? (
        <div className="bg-gradient-to-b from-slate-800 to-slate-850 rounded-3xl p-6 border-2 border-emerald-500/40 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              CURRENT ACTIVE STOP
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-700 text-slate-200">
              {TIER_CONFIG[activeShipment.deliveryTier]?.label}
            </span>
          </div>

          <div>
            <div className="text-xs text-slate-400">Recipient Dropoff:</div>
            <h2 className="text-lg font-bold text-white mt-0.5">
              {activeShipment.destination.street}
            </h2>
            <p className="text-xs text-slate-300">
              {activeShipment.destination.city}, {activeShipment.destination.postalCode || 'NY'}
            </p>
          </div>

          <div className="p-3 bg-slate-900/80 rounded-2xl border border-slate-700/60 flex items-center justify-between text-xs">
            <div>
              <span className="text-slate-400 block text-[10px]">Package Cargo:</span>
              <span className="font-semibold text-slate-200">{activeShipment.package.description}</span>
            </div>
            <div className="text-right">
              <span className="text-slate-400 block text-[10px]">Weight:</span>
              <span className="font-mono font-bold text-emerald-400">{activeShipment.package.weightKg} kg</span>
            </div>
          </div>

          {activeShipment.specialInstructions && (
            <div className="text-xs text-amber-300 bg-amber-950/40 p-3 rounded-2xl border border-amber-800/40">
              <strong>Instructions:</strong> {activeShipment.specialInstructions}
            </div>
          )}

          {/* Quick Actions for Driver */}
          <div className="pt-2 flex items-center gap-3">
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
                `${activeShipment.destination.street}, ${activeShipment.destination.city}`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-3 px-4 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs flex items-center justify-center gap-2 transition-all shadow-md active:scale-95"
            >
              <Navigation className="w-4 h-4 fill-slate-950" />
              <span>Launch Navigation</span>
            </a>

            <a
              href={`tel:${activeShipment.customerPhone}`}
              className="p-3 rounded-full bg-slate-700 hover:bg-slate-600 text-white flex items-center justify-center transition-all"
              title="Call Recipient"
            >
              <Phone className="w-4 h-4" />
            </a>
          </div>

          <Link
            href={`/driver/deliveries/${activeShipment.id}`}
            className="block text-center text-xs text-slate-400 hover:text-emerald-400 font-semibold pt-1 transition-colors"
          >
            Update Stop Status & Record POD &rarr;
          </Link>
        </div>
      ) : (
        <div className="bg-slate-800 rounded-3xl p-8 text-center text-slate-400 text-xs border border-slate-700">
          <Truck className="w-8 h-8 mx-auto mb-2 text-slate-500" />
          <span>No active assignments in your dispatch queue.</span>
        </div>
      )}

      {/* Upcoming Stops List */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Today&apos;s Stop Manifest
        </h3>

        <div className="space-y-2.5">
          {shipments.map((shp, idx) => {
            const statusConf = STATUS_CONFIG[shp.status] || STATUS_CONFIG.PENDING;
            return (
              <Link
                key={shp.id}
                href={`/driver/deliveries/${shp.id}`}
                className="bg-slate-800 hover:bg-slate-750 p-4 rounded-2xl border border-slate-700/80 flex items-center justify-between transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-slate-700 text-slate-300 flex items-center justify-center font-bold text-xs font-mono">
                    #{idx + 1}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">
                      {shp.destination.street}
                    </div>
                    <div className="text-[11px] text-slate-400">{shp.destination.city}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase border ${statusConf.bg} ${statusConf.text} ${statusConf.border}`}
                  >
                    {statusConf.label}
                  </span>
                  <ChevronRight className="w-4 h-4 text-slate-500" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
