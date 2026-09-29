'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { formatDate } from '@/lib/formatters';
import { Shipment } from '@/types';
import { CheckCircle2, ChevronRight, ArrowLeft } from 'lucide-react';

export default function DriverHistoryPage() {
  const [completedShipments, setCompletedShipments] = useState<Shipment[]>([]);

  useEffect(() => {
    fetch('/api/shipments')
      .then((r) => r.json())
      .then((d) => {
        if (d.success && Array.isArray(d.data)) {
          setCompletedShipments(d.data.filter((s: Shipment) => s.status === 'DELIVERED'));
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="p-4 sm:p-6 max-w-lg mx-auto w-full space-y-6">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <Link
          href="/driver"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Cockpit</span>
        </Link>
        <h1 className="text-sm font-extrabold text-white uppercase tracking-wider">
          Completed Deliveries
        </h1>
      </div>

      <div className="space-y-3">
        {completedShipments.map((shp) => (
          <div
            key={shp.id}
            className="bg-slate-800 p-4 rounded-2xl border border-slate-700 space-y-2 text-xs"
          >
            <div className="flex items-center justify-between">
              <span className="font-mono font-bold text-emerald-400">{shp.trackingNumber}</span>
              <span className="inline-flex items-center gap-1 text-emerald-400 font-bold text-[10px] uppercase">
                <CheckCircle2 className="w-3 h-3" /> Signed POD
              </span>
            </div>

            <div className="text-white font-semibold">{shp.destination.street}, {shp.destination.city}</div>
            <p className="text-slate-400 text-[11px]">{shp.package.description}</p>

            <div className="pt-2 border-t border-slate-700/60 flex justify-between text-[11px] text-slate-400">
              <span>Recipient: {shp.proofOfDelivery?.receiverName || 'Authorized Reception'}</span>
              <span>{formatDate(shp.actualDeliveryTime || shp.updatedAt)}</span>
            </div>
          </div>
        ))}

        {completedShipments.length === 0 && (
          <div className="p-8 text-center text-slate-400 text-xs">
            No completed deliveries recorded in this session.
          </div>
        )}
      </div>
    </div>
  );
}
