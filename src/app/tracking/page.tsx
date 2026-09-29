'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Header } from '@/components/landing/Header';
import { Footer } from '@/components/landing/Footer';
import { InteractiveMap } from '@/components/shared/InteractiveMap';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { STATUS_CONFIG, TIER_CONFIG } from '@/lib/constants';
import { formatDate, formatDateTime } from '@/lib/formatters';
import { Shipment } from '@/types';
import {
  Search,
  Package,
  MapPin,
  Clock,
  User,
  ShieldCheck,
  CheckCircle2,
  FileCheck2,
  AlertCircle,
  Truck,
} from 'lucide-react';

function TrackingContent() {
  const searchParams = useSearchParams();
  const initialId = searchParams.get('id') || 'FLW-2026-89421';

  const [query, setQuery] = useState(initialId);
  const [loading, setLoading] = useState(false);
  const [shipment, setShipment] = useState<Shipment | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchTracking = async (trackingNo: string) => {
    if (!trackingNo.trim()) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/tracking/${encodeURIComponent(trackingNo.trim())}`);
      const data = await res.json();
      if (data.success && data.data) {
        setShipment(data.data);
      } else {
        setError(data.error?.message || `No shipment found matching tracking ID '${trackingNo}'.`);
        setShipment(null);
      }
    } catch {
      setError('Unable to connect to tracking telemetry. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialId) {
      fetchTracking(initialId);
    }
  }, [initialId]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchTracking(query);
  };

  const sampleNumbers = ['FLW-2026-89421', 'FLW-2026-10293', 'FLW-2026-44019'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 flex-1">
      {/* Search Header Banner */}
      <div className="max-w-3xl mx-auto text-center mb-10">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-brand-navy tracking-tight mb-3">
          Shipment Telemetry & Tracking
        </h1>
        <p className="text-slate-600 text-sm sm:text-base mb-6">
          Real-time GPS coordinates, milestone timestamps, and chain-of-custody verification.
        </p>

        {/* Input Bar */}
        <form onSubmit={handleSearchSubmit} className="relative flex items-center shadow-elevated rounded-full">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter tracking number (e.g. FLW-2026-89421)"
            className="w-full bg-white border border-slate-200 text-slate-800 text-sm sm:text-base rounded-full pl-6 pr-32 py-4 focus:outline-none focus:border-brand-teal focus:ring-2 focus:ring-brand-teal/20 transition-all font-mono"
          />
          <div className="absolute right-2 flex items-center">
            <Button
              type="submit"
              variant="pill-primary"
              size="md"
              isLoading={loading}
              leftIcon={<Search className="w-4 h-4" />}
            >
              Track
            </Button>
          </div>
        </form>

        {/* Quick Sample Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-4 text-xs text-slate-500">
          <span>Try quick sample:</span>
          {sampleNumbers.map((num) => (
            <button
              key={num}
              onClick={() => {
                setQuery(num);
                fetchTracking(num);
              }}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1 rounded-full font-mono transition-colors"
            >
              {num}
            </button>
          ))}
        </div>
      </div>

      {/* Error Notice */}
      {error && (
        <div className="max-w-2xl mx-auto p-4 mb-8 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-3 text-rose-800 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0 text-rose-600" />
          <span>{error}</span>
        </div>
      )}

      {/* Tracking Details Results */}
      {shipment && (
        <div className="space-y-8 animate-in fade-in duration-300">
          {/* Top Status Header Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="font-mono text-xl sm:text-2xl font-bold text-brand-navy">
                  {shipment.trackingNumber}
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold border uppercase tracking-wider ${
                    STATUS_CONFIG[shipment.status]?.bg
                  } ${STATUS_CONFIG[shipment.status]?.text} ${
                    STATUS_CONFIG[shipment.status]?.border
                  }`}
                >
                  {STATUS_CONFIG[shipment.status]?.label || shipment.status}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500">
                Service: <span className="font-semibold text-slate-700">{TIER_CONFIG[shipment.deliveryTier]?.label}</span> &bull; Estimated Arrival: <span className="font-semibold text-slate-700">{formatDateTime(shipment.estimatedDeliveryTime)}</span>
              </p>
            </div>

            {shipment.driverName && (
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="w-10 h-10 rounded-full bg-brand-teal text-white flex items-center justify-center font-bold text-sm">
                  {shipment.driverName.charAt(0)}
                </div>
                <div className="text-xs">
                  <div className="font-semibold text-slate-900">{shipment.driverName}</div>
                  <div className="text-slate-500">Assigned Driver &bull; {shipment.driverPhone || 'Verified'}</div>
                </div>
              </div>
            )}
          </div>

          {/* Map and Route Section */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Interactive Map */}
            <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-subtle">
              <h3 className="text-base font-bold text-brand-navy mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-brand-teal" />
                <span>Live Route Telemetry</span>
              </h3>
              <InteractiveMap
                height="380px"
                origin={{
                  lat: shipment.origin.coordinates?.lat || 40.7128,
                  lng: shipment.origin.coordinates?.lng || -74.006,
                  label: `${shipment.origin.city} (${shipment.origin.street})`,
                }}
                destination={{
                  lat: shipment.destination.coordinates?.lat || 40.7589,
                  lng: shipment.destination.coordinates?.lng || -73.9851,
                  label: `${shipment.destination.city} (${shipment.destination.street})`,
                }}
                currentLocation={
                  shipment.status === 'IN_TRANSIT' || shipment.status === 'OUT_FOR_DELIVERY'
                    ? { lat: 40.7306, lng: -73.9352 }
                    : undefined
                }
              />
            </div>

            {/* Shipment Event Timeline */}
            <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-subtle">
              <h3 className="text-base font-bold text-brand-navy mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-brand-teal" />
                <span>Milestone History</span>
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

          {/* Package Details & Proof of Delivery */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Cargo Specifications */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-subtle">
              <h3 className="text-base font-bold text-brand-navy mb-4 flex items-center gap-2">
                <Package className="w-5 h-5 text-brand-teal" />
                <span>Cargo Specifications</span>
              </h3>
              <dl className="grid grid-cols-2 gap-4 text-xs sm:text-sm">
                <div>
                  <dt className="text-slate-500">Category</dt>
                  <dd className="font-semibold text-slate-900 mt-0.5">{shipment.package.category}</dd>
                </div>
                <div>
                  <dt className="text-slate-500">Gross Weight</dt>
                  <dd className="font-semibold text-slate-900 mt-0.5">{shipment.package.weightKg} kg</dd>
                </div>
                <div>
                  <dt className="text-slate-500">Dimensions</dt>
                  <dd className="font-semibold text-slate-900 mt-0.5">
                    {shipment.package.dimensions.lengthCm} &times; {shipment.package.dimensions.widthCm} &times; {shipment.package.dimensions.heightCm} cm
                  </dd>
                </div>
                <div>
                  <dt className="text-slate-500">Declared Value</dt>
                  <dd className="font-semibold text-slate-900 mt-0.5">${shipment.package.declaredValue.toFixed(2)}</dd>
                </div>
                <div className="col-span-2 pt-2 border-t border-slate-100">
                  <dt className="text-slate-500">Cargo Description</dt>
                  <dd className="text-slate-800 mt-0.5">{shipment.package.description}</dd>
                </div>
              </dl>
            </div>

            {/* Proof of Delivery (if completed) */}
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
                  <div>
                    <span className="text-slate-500">Timestamp:</span>
                    <span className="font-semibold text-slate-900 ml-2">
                      {formatDateTime(shipment.proofOfDelivery.signedAt)}
                    </span>
                  </div>
                  {shipment.proofOfDelivery.signatureDataUrl && (
                    <div>
                      <span className="text-slate-500 block mb-1">Captured Signature:</span>
                      <div className="border border-slate-200 rounded-xl p-2 bg-slate-50 max-w-[280px]">
                        <img
                          src={shipment.proofOfDelivery.signatureDataUrl}
                          alt="Recipient signature"
                          className="h-16 object-contain"
                        />
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 text-slate-400 text-xs">
                  <FileCheck2 className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                  <p>Proof of delivery will be recorded when the driver completes dropoff.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function TrackingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50/50">
      <Header />
      <Suspense fallback={<div className="p-12 text-center text-slate-500">Loading tracking portal...</div>}>
        <TrackingContent />
      </Suspense>
      <Footer />
    </div>
  );
}
