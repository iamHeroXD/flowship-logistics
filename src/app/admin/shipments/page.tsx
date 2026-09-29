'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { DashboardHeader } from '@/components/layout/DashboardHeader';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { Select } from '@/components/ui/Select';
import { useToast } from '@/contexts/ToastContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import { STATUS_CONFIG, TIER_CONFIG } from '@/lib/constants';
import { formatDateTime } from '@/lib/formatters';
import { Shipment, ShipmentStatus } from '@/types';
import {
  Package,
  Search,
  SlidersHorizontal,
  ChevronRight,
  ShieldAlert,
  CheckCircle2,
} from 'lucide-react';

export default function AdminShipmentsPage() {
  const { format } = useCurrency();
  const { success, error } = useToast();

  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);

  // Admin Override Modal
  const [overrideModalOpen, setOverrideModalOpen] = useState(false);
  const [targetShipment, setTargetShipment] = useState<Shipment | null>(null);
  const [targetStatus, setTargetStatus] = useState<ShipmentStatus>('IN_TRANSIT');
  const [overrideNotes, setOverrideNotes] = useState('Administrative state override authorized by Operations Supervisor.');
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchShipments = () => {
    fetch('/api/shipments')
      .then((r) => r.json())
      .then((d) => {
        if (d.success && Array.isArray(d.data)) {
          setShipments(d.data);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchShipments();
  }, []);

  const handleAdminOverride = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetShipment) return;

    setIsUpdating(true);
    try {
      const res = await fetch(`/api/shipments/${targetShipment.id}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: targetStatus,
          actor: { id: 'usr_adm_1', name: 'Sarah Jenkins', role: 'ADMIN' },
          notes: overrideNotes,
        }),
      });
      const data = await res.json();
      if (data.success) {
        success(`Shipment state updated to ${targetStatus}`);
        setOverrideModalOpen(false);
        fetchShipments();
      } else {
        error(data.error?.message || 'Override rejected by state machine.');
      }
    } catch {
      error('Failed to execute administrative update.');
    } finally {
      setIsUpdating(false);
    }
  };

  const filtered = shipments.filter((s) => {
    const matchesSearch =
      s.trackingNumber.toLowerCase().includes(search.toLowerCase()) ||
      s.customerName.toLowerCase().includes(search.toLowerCase()) ||
      s.destination.city.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || s.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <>
      <DashboardHeader
        title="Universal Shipments Ledger"
        subtitle="Full administrative control over all global freight waybills and chain-of-custody milestones."
      />

      <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-6">
        {/* Controls */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-subtle flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="w-full md:w-96">
            <Input
              placeholder="Search tracking, client name, or city..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              leftIcon={<Search className="w-4 h-4 text-slate-400" />}
            />
          </div>

          <div className="flex items-center gap-3">
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              options={[
                { value: 'ALL', label: 'All Lifecycle States' },
                { value: 'PENDING', label: 'PENDING' },
                { value: 'ASSIGNED', label: 'ASSIGNED' },
                { value: 'PICKED_UP', label: 'PICKED_UP' },
                { value: 'IN_TRANSIT', label: 'IN_TRANSIT' },
                { value: 'OUT_FOR_DELIVERY', label: 'OUT_FOR_DELIVERY' },
                { value: 'DELIVERED', label: 'DELIVERED' },
                { value: 'CANCELLED', label: 'CANCELLED' },
              ]}
            />
          </div>
        </div>

        {/* Universal Table */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-subtle overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[11px] font-bold border-b border-slate-100">
                <tr>
                  <th className="py-3.5 px-6">Tracking Number</th>
                  <th className="py-3.5 px-6">Shipper Client</th>
                  <th className="py-3.5 px-6">Corridor Route</th>
                  <th className="py-3.5 px-6">Assigned Driver</th>
                  <th className="py-3.5 px-6">Status</th>
                  <th className="py-3.5 px-6 text-right">Fare</th>
                  <th className="py-3.5 px-6 text-right">Supervision</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {filtered.map((shp) => {
                  const statusConf = STATUS_CONFIG[shp.status] || STATUS_CONFIG.PENDING;
                  return (
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
                        <div className="font-semibold text-slate-900">{shp.customerName}</div>
                        <div className="text-[11px] text-slate-400">{shp.customerEmail}</div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="font-semibold text-slate-900">{shp.origin.city} &rarr; {shp.destination.city}</div>
                        <div className="text-[11px] text-slate-400">{shp.package.weightKg} kg &bull; {shp.deliveryTier}</div>
                      </td>
                      <td className="py-4 px-6">
                        {shp.driverName ? (
                          <div>
                            <span className="font-semibold text-slate-900">{shp.driverName}</span>
                            <div className="text-[10px] text-slate-400 font-mono">{shp.vehicleId || 'Assigned'}</div>
                          </div>
                        ) : (
                          <span className="text-amber-600 font-bold text-xs bg-amber-50 px-2 py-0.5 rounded-full">
                            Unassigned
                          </span>
                        )}
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
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setTargetShipment(shp);
                            setTargetStatus(shp.status);
                            setOverrideModalOpen(true);
                          }}
                          leftIcon={<ShieldAlert className="w-3.5 h-3.5 text-brand-teal" />}
                        >
                          Override
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {filtered.length === 0 && !loading && (
              <div className="p-12 text-center text-slate-400 text-xs">
                No shipments found matching filter criteria.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Administrative Override Modal */}
      {targetShipment && (
        <Modal
          isOpen={overrideModalOpen}
          onClose={() => setOverrideModalOpen(false)}
          title="Administrative Lifecycle State Override"
          description={`Force transition lifecycle for shipment ${targetShipment.trackingNumber}.`}
        >
          <form onSubmit={handleAdminOverride} className="space-y-4 text-xs">
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900">
              <strong>Notice:</strong> State transitions must conform to the shipment lifecycle state machine rules.
            </div>

            <Select
              label="Target State"
              value={targetStatus}
              onChange={(e) => setTargetStatus(e.target.value as ShipmentStatus)}
              options={[
                { value: 'PENDING', label: 'PENDING' },
                { value: 'ASSIGNED', label: 'ASSIGNED' },
                { value: 'PICKED_UP', label: 'PICKED_UP' },
                { value: 'IN_TRANSIT', label: 'IN_TRANSIT' },
                { value: 'OUT_FOR_DELIVERY', label: 'OUT_FOR_DELIVERY' },
                { value: 'DELIVERED', label: 'DELIVERED' },
                { value: 'CANCELLED', label: 'CANCELLED' },
              ]}
            />

            <Input
              label="Supervisor Reason / Audit Note"
              value={overrideNotes}
              onChange={(e) => setOverrideNotes(e.target.value)}
              required
            />

            <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
              <Button variant="outline" onClick={() => setOverrideModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="pill-primary" type="submit" isLoading={isUpdating}>
                Execute State Change
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
}
