'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { DashboardHeader } from '@/components/layout/DashboardHeader';
import { InteractiveMap } from '@/components/shared/InteractiveMap';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { STATUS_CONFIG, TIER_CONFIG } from '@/lib/constants';
import { formatDateTime } from '@/lib/formatters';
import { Shipment } from '@/types';
import { Search, MapPin, Package, ArrowRight, Clock } from 'lucide-react';

export default function CustomerTrackingPage() {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch('/api/shipments?customerId=usr_cust_1')
      .then((r) => r.json())
      .then((d) => {
        if (d.success && Array.isArray(d.data)) {
          setShipments(d.data);
          if (d.data.length > 0) setSelectedShipment(d.data[0]);
        }
      })
      .catch(() => {});
  }, []);

  const filtered = shipments.filter(
    (s) =>
      s.trackingNumber.toLowerCase().includes(search.toLowerCase()) ||
      s.destination.city.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <DashboardHeader
        title="Live Fleet & Shipment Tracking"
        subtitle="Millimeter telemetry updates, driver location, and geodesic routing corridors."
      />

      <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Shipments Selector List */}
          <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-subtle space-y-4">
            <h2 className="text-base font-bold text-brand-navy">Active Consignments</h2>

            <Input
              placeholder="Filter by tracking #..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              leftIcon={<Search className="w-4 h-4 text-slate-400" />}
            />

            <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
              {filtered.map((shp) => {
                const isSelected = selectedShipment?.id === shp.id;
                const statusConf = STATUS_CONFIG[shp.status] || STATUS_CONFIG.PENDING;
                return (
                  <div
                    key={shp.id}
                    onClick={() => setSelectedShipment(shp)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-brand-teal bg-brand-surface ring-2 ring-brand-teal/20'
                        : 'border-slate-100 hover:border-slate-200 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono font-bold text-xs text-brand-navy">
                        {shp.trackingNumber}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase border ${statusConf.bg} ${statusConf.text} ${statusConf.border}`}
                      >
                        {statusConf.label}
                      </span>
                    </div>

                    <div className="text-xs text-slate-700 font-semibold">
                      {shp.origin.city} &rarr; {shp.destination.city}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>ETA: {formatDateTime(shp.estimatedDeliveryTime)}</span>
                    </div>
                  </div>
                );
              })}

              {filtered.length === 0 && (
                <div className="py-8 text-center text-xs text-slate-400">
                  No shipments matching your filter.
                </div>
              )}
            </div>
          </div>

          {/* Right: Map & Detail Panel */}
          <div className="lg:col-span-8 space-y-6">
            {selectedShipment ? (
              <>
                <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-subtle">
                  <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xl font-bold text-brand-navy">
                          {selectedShipment.trackingNumber}
                        </span>
                        <span className="text-xs font-semibold text-slate-500">
                          ({selectedShipment.package.description})
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 mt-1">
                        Driver: <strong>{selectedShipment.driverName || 'Automating dispatch'}</strong> &bull; Carrier SLA: {TIER_CONFIG[selectedShipment.deliveryTier]?.label}
                      </div>
                    </div>

                    <Link href={`/dashboard/shipments/${selectedShipment.id}`}>
                      <Button variant="pill-primary" size="sm">
                        View Detailed Dossier &rarr;
                      </Button>
                    </Link>
                  </div>

                  <InteractiveMap
                    height="420px"
                    origin={{
                      lat: selectedShipment.origin.coordinates?.lat || 40.7128,
                      lng: selectedShipment.origin.coordinates?.lng || -74.006,
                      label: selectedShipment.origin.city,
                    }}
                    destination={{
                      lat: selectedShipment.destination.coordinates?.lat || 40.7589,
                      lng: selectedShipment.destination.coordinates?.lng || -73.9851,
                      label: selectedShipment.destination.city,
                    }}
                    currentLocation={
                      selectedShipment.status === 'IN_TRANSIT' || selectedShipment.status === 'OUT_FOR_DELIVERY'
                        ? { lat: 40.7306, lng: -73.9352 }
                        : undefined
                    }
                  />
                </div>
              </>
            ) : (
              <div className="bg-white rounded-3xl p-12 text-center text-slate-400 border border-slate-200">
                Select a shipment on the left to inspect real-time telemetry.
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
