'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { DashboardHeader } from '@/components/layout/DashboardHeader';
import { InteractiveMap } from '@/components/shared/InteractiveMap';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/contexts/ToastContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import { STATUS_CONFIG, TIER_CONFIG } from '@/lib/constants';
import { formatDateTime } from '@/lib/formatters';
import { Shipment } from '@/types';
import {
  Package,
  MapPin,
  Clock,
  User,
  ShieldCheck,
  CheckCircle2,
  FileCheck2,
  Receipt,
  ArrowLeft,
  XCircle,
  Truck,
} from 'lucide-react';

export default function ShipmentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { success, error } = useToast();
  const { format } = useCurrency();

  const [shipment, setShipment] = useState<Shipment | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  const fetchShipment = () => {
    fetch(`/api/shipments/${params.id}`)
      .then((res) => res.json())
      .then((d) => {
        if (d.success && d.data) {
          setShipment(d.data);
        } else {
          error('Shipment not found.');
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchShipment();
  }, [params.id]);

  const handleCancel = async () => {
    if (!confirm('Are you sure you want to cancel this shipment booking?')) return;
    setCancelling(true);
    try {
      const res = await fetch(`/api/shipments/${params.id}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'CANCELLED',
          actor: { id: 'usr_cust_1', name: 'Elena Rostova', role: 'CUSTOMER' },
          notes: 'Customer initiated order cancellation.',
        }),
      });
      const data = await res.json();
      if (data.success) {
        success('Shipment successfully cancelled.');
        fetchShipment();
      } else {
        error(data.error?.message || 'Failed to cancel shipment.');
      }
    } catch {
      error('Error connecting to cancellation service.');
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return <div className="p-12 text-center text-slate-500">Loading consignment telemetry...</div>;
  }

  if (!shipment) {
    return (
      <div className="p-12 text-center space-y-4">
        <h2 className="text-xl font-bold text-brand-navy">Shipment Not Found</h2>
        <Link href="/dashboard/shipments">
          <Button variant="pill-primary">Return to Shipments</Button>
        </Link>
      </div>
    );
  }

  const statusConf = STATUS_CONFIG[shipment.status] || STATUS_CONFIG.PENDING;

  return (
    <>
      <DashboardHeader
        title={`Shipment ${shipment.trackingNumber}`}
        subtitle={`Created on ${formatDateTime(shipment.createdAt)}`}
      />

      <div className="p-6 sm:p-8 space-y-8 max-w-7xl">
        {/* Top Action Header */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/dashboard/shipments"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-brand-navy"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Shipments</span>
          </Link>

          <div className="flex items-center gap-3">
            <Link href={`/tracking?id=${shipment.trackingNumber}`}>
              <Button variant="outline" size="sm">
                Open Public Tracking URL
              </Button>
            </Link>

            <Link href={`/dashboard/invoices?shipmentId=${shipment.id}`}>
              <Button variant="pill-secondary" size="sm" leftIcon={<Receipt className="w-4 h-4" />}>
                View Formal Invoice
              </Button>
            </Link>

            {shipment.status === 'PENDING' && (
              <Button
                variant="danger"
                size="sm"
                onClick={handleCancel}
                isLoading={cancelling}
                leftIcon={<XCircle className="w-4 h-4" />}
              >
                Cancel Order
              </Button>
            )}
          </div>
        </div>

        {/* Status Card Banner */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-subtle flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="font-mono text-2xl font-extrabold text-brand-navy">
                {shipment.trackingNumber}
              </span>
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border uppercase tracking-wider ${statusConf.bg} ${statusConf.text} ${statusConf.border}`}
              >
                <span className="w-2 h-2 rounded-full bg-current" />
                <span>{statusConf.label}</span>
              </span>
            </div>
            <p className="text-xs text-slate-500">
              {shipment.origin.city} &rarr; {shipment.destination.city} &bull; Service SLA: {TIER_CONFIG[shipment.deliveryTier]?.label}
            </p>
          </div>

          <div className="flex items-center gap-6">
            <div>
              <div className="text-xs text-slate-400 font-semibold uppercase">Total Fee</div>
              <div className="text-2xl font-black text-brand-navy">
                {format(shipment.pricing.total)}
              </div>
            </div>
            <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs font-semibold text-emerald-800 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Payment Settled</span>
            </div>
          </div>
        </div>

        {/* Map and Timeline Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-subtle">
            <h3 className="text-base font-bold text-brand-navy mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-brand-teal" />
              <span>Geodesic Transit Corridor</span>
            </h3>
            <InteractiveMap
              height="360px"
              origin={{
                lat: shipment.origin.coordinates?.lat || 40.7128,
                lng: shipment.origin.coordinates?.lng || -74.006,
                label: shipment.origin.city,
              }}
              destination={{
                lat: shipment.destination.coordinates?.lat || 40.7589,
                lng: shipment.destination.coordinates?.lng || -73.9851,
                label: shipment.destination.city,
              }}
              currentLocation={
                shipment.status === 'IN_TRANSIT' || shipment.status === 'OUT_FOR_DELIVERY'
                  ? { lat: 40.7306, lng: -73.9352 }
                  : undefined
              }
            />
          </div>

          {/* Timeline */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-subtle">
            <h3 className="text-base font-bold text-brand-navy mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-brand-teal" />
              <span>Chain of Custody Events</span>
            </h3>

            <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
              {shipment.events.slice().reverse().map((evt, idx) => (
                <div key={evt.id || idx} className="relative">
                  <div
                    className={`absolute -left-[27px] top-1 w-3.5 h-3.5 rounded-full border-2 border-white ${
                      idx === 0 ? 'bg-brand-mint ring-4 ring-brand-mint/20' : 'bg-slate-400'
                    }`}
                  />
                  <div className="text-xs font-semibold text-slate-500">
                    {formatDateTime(evt.timestamp)}
                  </div>
                  <div className="text-sm font-bold text-slate-900 mt-0.5">
                    {STATUS_CONFIG[evt.status]?.label || evt.status}
                  </div>
                  <div className="text-xs text-slate-600 mt-0.5">{evt.location}</div>
                  {evt.notes && (
                    <p className="text-xs text-slate-500 mt-1 bg-slate-50 p-2 rounded-lg border border-slate-100">
                      {evt.notes}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Cargo & POD Proof */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-subtle">
            <h3 className="text-base font-bold text-brand-navy mb-4 flex items-center gap-2">
              <Package className="w-5 h-5 text-brand-teal" />
              <span>Cargo Specifications</span>
            </h3>
            <dl className="grid grid-cols-2 gap-4 text-xs sm:text-sm">
              <div>
                <dt className="text-slate-500">Declared Value</dt>
                <dd className="font-semibold text-slate-900 mt-0.5">${shipment.package.declaredValue}</dd>
              </div>
              <div>
                <dt className="text-slate-500">Chargeable Weight</dt>
                <dd className="font-semibold text-slate-900 mt-0.5">{shipment.package.weightKg} kg</dd>
              </div>
              <div className="col-span-2 pt-2 border-t border-slate-100">
                <dt className="text-slate-500">Package Description</dt>
                <dd className="text-slate-800 mt-0.5 font-medium">{shipment.package.description}</dd>
              </div>
            </dl>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-subtle">
            <h3 className="text-base font-bold text-brand-navy mb-4 flex items-center gap-2">
              <FileCheck2 className="w-5 h-5 text-brand-teal" />
              <span>Proof of Delivery (POD)</span>
            </h3>
            {shipment.proofOfDelivery ? (
              <div className="space-y-4 text-xs sm:text-sm">
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-emerald-800 font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Delivered & Officially Signed</span>
                </div>
                <div>
                  <span className="text-slate-500">Receiver Name:</span>
                  <span className="font-semibold text-slate-900 ml-2">
                    {shipment.proofOfDelivery.receiverName}
                  </span>
                </div>
                {shipment.proofOfDelivery.signatureDataUrl && (
                  <div>
                    <span className="text-slate-500 block mb-1">Captured Signature:</span>
                    <div className="border border-slate-200 rounded-xl p-2 bg-slate-50 max-w-[280px]">
                      <img
                        src={shipment.proofOfDelivery.signatureDataUrl}
                        alt="Signature"
                        className="h-16 object-contain"
                      />
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-slate-400 text-xs">
                <FileCheck2 className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                <p>Proof of delivery will be updated upon physical completion.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
