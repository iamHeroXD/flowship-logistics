'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { DashboardHeader } from '@/components/layout/DashboardHeader';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Select } from '@/components/ui/Select';
import { useToast } from '@/contexts/ToastContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import { STATUS_CONFIG, TIER_CONFIG } from '@/lib/constants';
import { formatDateTime } from '@/lib/formatters';
import { Driver, Shipment } from '@/types';
import {
  Navigation,
  Truck,
  Zap,
  Users,
  AlertCircle,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';

export default function DispatcherPage() {
  const { success, error } = useToast();
  const { format } = useCurrency();

  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);

  // Manual Assign Modal
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);
  const [selectedDriverId, setSelectedDriverId] = useState<string>('');
  const [isAssigning, setIsAssigning] = useState(false);

  // Auto-dispatching state
  const [autoDispatchingId, setAutoDispatchingId] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const [shipRes, drivRes] = await Promise.all([
        fetch('/api/shipments'),
        fetch('/api/drivers'),
      ]);
      const shipData = await shipRes.json();
      const drivData = await drivRes.json();

      if (shipData.success && Array.isArray(shipData.data)) {
        setShipments(shipData.data);
      }
      if (drivData.success && Array.isArray(drivData.data)) {
        setDrivers(drivData.data);
        if (drivData.data.length > 0) setSelectedDriverId(drivData.data[0].id);
      }
    } catch {
      error('Failed to load operational dispatch board.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAutoDispatch = async (shipmentId: string) => {
    setAutoDispatchingId(shipmentId);
    try {
      const res = await fetch('/api/dispatch/auto-dispatch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          shipmentId,
          dispatcher: { id: 'usr_disp_1', name: 'Marcus Vance' },
        }),
      });
      const data = await res.json();
      if (data.success) {
        success(data.data.message || 'Auto-dispatch algorithm matched nearest driver!');
        fetchData();
      } else {
        error(data.error?.message || 'Auto-dispatching could not find an available driver.');
      }
    } catch {
      error('Connection error.');
    } finally {
      setAutoDispatchingId(null);
    }
  };

  const handleManualAssign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedShipment || !selectedDriverId) return;

    setIsAssigning(true);
    try {
      const res = await fetch('/api/dispatch/assign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          shipmentId: selectedShipment.id,
          driverId: selectedDriverId,
          dispatcher: { id: 'usr_disp_1', name: 'Marcus Vance' },
        }),
      });
      const data = await res.json();
      if (data.success) {
        success(`Successfully assigned to driver!`);
        setAssignModalOpen(false);
        fetchData();
      } else {
        error(data.error?.message || 'Manual assignment rejected.');
      }
    } catch {
      error('Error executing assignment.');
    } finally {
      setIsAssigning(false);
    }
  };

  const pendingShipments = shipments.filter((s) => s.status === 'PENDING');
  const activeDeliveries = shipments.filter(
    (s) => s.status === 'ASSIGNED' || s.status === 'PICKED_UP' || s.status === 'IN_TRANSIT' || s.status === 'OUT_FOR_DELIVERY'
  );

  return (
    <>
      <DashboardHeader
        title="Fleet Dispatch Command Hub"
        subtitle="Manage pending consignments, monitor active courier corridors, and execute automated driver pairings."
      />

      <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-8">
        {/* KPI Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-subtle flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Unassigned Freight Queue
              </span>
              <div className="text-3xl font-extrabold text-amber-600 mt-1">
                {pendingShipments.length}
              </div>
              <p className="text-[11px] text-slate-500 mt-1">Requires driver pairing</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-subtle flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Active in Transit
              </span>
              <div className="text-3xl font-extrabold text-brand-navy mt-1">
                {activeDeliveries.length}
              </div>
              <p className="text-[11px] text-slate-500 mt-1">Monitored by GPS radar</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-brand-mint flex items-center justify-center">
              <Navigation className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-subtle flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Active Fleet Couriers
              </span>
              <div className="text-3xl font-extrabold text-brand-teal mt-1">
                {drivers.filter((d) => d.status === 'AVAILABLE').length} / {drivers.length}
              </div>
              <p className="text-[11px] text-emerald-600 font-semibold mt-1">Available on duty</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-brand-teal flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Unassigned Shipments Queue */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-subtle overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-brand-navy flex items-center gap-2">
                <span>Unassigned Shipments Queue</span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
                  {pendingShipments.length} Pending
                </span>
              </h2>
              <p className="text-xs text-slate-500">
                Incoming orders awaiting vehicle and courier assignment.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[11px] font-bold border-b border-slate-100">
                <tr>
                  <th className="py-3.5 px-6">Tracking Number</th>
                  <th className="py-3.5 px-6">Origin Hub &rarr; Dropoff</th>
                  <th className="py-3.5 px-6">Cargo Mass</th>
                  <th className="py-3.5 px-6">SLA Tier</th>
                  <th className="py-3.5 px-6 text-right">Dispatch Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {pendingShipments.map((shp) => (
                  <tr key={shp.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-4 px-6 font-mono font-bold text-brand-navy">
                      <Link href={`/dashboard/shipments/${shp.id}`} className="hover:underline">
                        {shp.trackingNumber}
                      </Link>
                      <div className="text-[11px] font-normal text-slate-400">
                        {formatDateTime(shp.createdAt)}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="font-semibold text-slate-900">
                        {shp.origin.city} &rarr; {shp.destination.city}
                      </div>
                      <div className="text-[11px] text-slate-400 truncate max-w-xs">
                        {shp.destination.street}
                      </div>
                    </td>
                    <td className="py-4 px-6 font-mono font-bold text-slate-900">
                      {shp.package.weightKg} kg
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-xs font-bold text-brand-teal bg-brand-surface px-2.5 py-1 rounded-full border border-slate-200">
                        {TIER_CONFIG[shp.deliveryTier]?.label}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="pill-primary"
                          size="sm"
                          isLoading={autoDispatchingId === shp.id}
                          onClick={() => handleAutoDispatch(shp.id)}
                          className="bg-emerald-600 hover:bg-emerald-500"
                          leftIcon={<Zap className="w-3.5 h-3.5" />}
                        >
                          Auto-Dispatch
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedShipment(shp);
                            setAssignModalOpen(true);
                          }}
                        >
                          Manual Assign
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {pendingShipments.length === 0 && !loading && (
              <div className="p-12 text-center text-slate-400 text-xs">
                <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-emerald-500" />
                <span>All freight orders are currently assigned or in transit!</span>
              </div>
            )}
          </div>
        </div>

        {/* Couriers Fleet Roster */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-subtle space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-brand-navy">Active Fleet Driver Roster</h3>
              <p className="text-xs text-slate-500">Live courier duty statuses and vehicle load capacity.</p>
            </div>
            <Link
              href="/dispatcher/live-map"
              className="text-xs font-bold text-brand-teal hover:underline flex items-center gap-1"
            >
              <span>Inspect on Radar Map</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {drivers.map((drv) => (
              <div
                key={drv.id}
                className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-brand-navy text-white flex items-center justify-center font-bold text-xs">
                      {drv.name.split(' ').map((n) => n[0]).join('')}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900">{drv.name}</div>
                      <div className="text-[10px] text-slate-500 font-mono">{drv.licenseNumber}</div>
                    </div>
                  </div>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase border ${
                      drv.status === 'AVAILABLE'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : drv.status === 'BUSY'
                        ? 'bg-amber-50 text-amber-800 border-amber-200'
                        : 'bg-slate-200 text-slate-700 border-slate-300'
                    }`}
                  >
                    {drv.status}
                  </span>
                </div>

                <div className="text-[11px] text-slate-600 flex justify-between border-t border-slate-200/60 pt-2">
                  <span>Rating: <strong>{drv.rating} &#9733;</strong></span>
                  <span>Deliveries: <strong>{drv.totalDeliveries}</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Manual Driver Assignment Modal */}
      {selectedShipment && (
        <Modal
          isOpen={assignModalOpen}
          onClose={() => setAssignModalOpen(false)}
          title="Manual Driver Pairing"
          description={`Assign shipment ${selectedShipment.trackingNumber} to an active courier.`}
        >
          <form onSubmit={handleManualAssign} className="space-y-4">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-1">
              <div className="font-bold text-slate-900">{selectedShipment.destination.city}</div>
              <div className="text-slate-500">
                Cargo Weight: {selectedShipment.package.weightKg} kg &bull; SLA: {selectedShipment.deliveryTier}
              </div>
            </div>

            <Select
              label="Select Available Driver"
              value={selectedDriverId}
              onChange={(e) => setSelectedDriverId(e.target.value)}
              options={drivers.map((d) => ({
                value: d.id,
                label: `${d.name} (${d.status} - License: ${d.licenseNumber})`,
              }))}
            />

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
              <Button variant="outline" onClick={() => setAssignModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="pill-primary" type="submit" isLoading={isAssigning}>
                Confirm Pairing & Advance to ASSIGNED
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
}
