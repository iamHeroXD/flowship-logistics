'use client';

import React, { useState } from 'react';
import { DashboardHeader } from '@/components/layout/DashboardHeader';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { useToast } from '@/contexts/ToastContext';
import { Settings, Globe, CreditCard, Map, Save, ShieldCheck } from 'lucide-react';

export default function AdminSettingsPage() {
  const { success } = useToast();

  const [multiCity, setMultiCity] = useState(true);
  const [autoDispatch, setAutoDispatch] = useState(true);
  const [stripeEnabled, setStripeEnabled] = useState(true);
  const [paystackEnabled, setPaystackEnabled] = useState(true);
  const [flutterwaveEnabled, setFlutterwaveEnabled] = useState(false);
  const [mapsProvider, setMapsProvider] = useState('internal_telemetry');
  const [saving, setSaving] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      success('Platform system configuration updated.');
    }, 500);
  };

  return (
    <>
      <DashboardHeader
        title="Enterprise System Settings"
        subtitle="Global logistics infrastructure parameters, gateway adapters, and telemetry frequencies."
      />

      <div className="p-6 sm:p-8 max-w-4xl mx-auto space-y-8">
        <form onSubmit={handleSave} className="space-y-8">
          {/* Operations & Corridors */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-subtle space-y-6">
            <h2 className="text-base font-bold text-brand-navy flex items-center gap-2">
              <Globe className="w-5 h-5 text-brand-teal" />
              <span>Multi-City Corridors & Automated Dispatch</span>
            </h2>

            <div className="space-y-3 text-xs">
              <label className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 bg-slate-50/50 cursor-pointer">
                <div>
                  <div className="font-bold text-slate-900">Multi-City Hub Routing</div>
                  <div className="text-slate-500">Allow cross-corridor transit between New York, Chicago, Los Angeles, and London.</div>
                </div>
                <input
                  type="checkbox"
                  checked={multiCity}
                  onChange={(e) => setMultiCity(e.target.checked)}
                  className="rounded text-brand-teal focus:ring-brand-teal"
                />
              </label>

              <label className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 bg-slate-50/50 cursor-pointer">
                <div>
                  <div className="font-bold text-slate-900">Automated Dispatch Engine</div>
                  <div className="text-slate-500">Automatically pair incoming urgent shipments with the closest available courier.</div>
                </div>
                <input
                  type="checkbox"
                  checked={autoDispatch}
                  onChange={(e) => setAutoDispatch(e.target.checked)}
                  className="rounded text-brand-teal focus:ring-brand-teal"
                />
              </label>
            </div>
          </div>

          {/* Payment Gateways */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-subtle space-y-6">
            <h2 className="text-base font-bold text-brand-navy flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-brand-teal" />
              <span>Payment Gateway Adapters</span>
            </h2>

            <div className="space-y-3 text-xs">
              <label className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 bg-slate-50/50 cursor-pointer">
                <div>
                  <div className="font-bold text-slate-900">Stripe Payments (Global Cards & Wallets)</div>
                  <div className="text-slate-500">Active development/production test adapter configured.</div>
                </div>
                <input
                  type="checkbox"
                  checked={stripeEnabled}
                  onChange={(e) => setStripeEnabled(e.target.checked)}
                  className="rounded text-brand-teal focus:ring-brand-teal"
                />
              </label>

              <label className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 bg-slate-50/50 cursor-pointer">
                <div>
                  <div className="font-bold text-slate-900">Paystack (West Africa / NGN Corridors)</div>
                  <div className="text-slate-500">Local currency bank transfer & card processing.</div>
                </div>
                <input
                  type="checkbox"
                  checked={paystackEnabled}
                  onChange={(e) => setPaystackEnabled(e.target.checked)}
                  className="rounded text-brand-teal focus:ring-brand-teal"
                />
              </label>

              <label className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 bg-slate-50/50 cursor-pointer">
                <div>
                  <div className="font-bold text-slate-900">Flutterwave</div>
                  <div className="text-slate-500">Pan-African settlement gateway.</div>
                </div>
                <input
                  type="checkbox"
                  checked={flutterwaveEnabled}
                  onChange={(e) => setFlutterwaveEnabled(e.target.checked)}
                  className="rounded text-brand-teal focus:ring-brand-teal"
                />
              </label>
            </div>
          </div>

          {/* Maps Provider */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-subtle space-y-4">
            <h2 className="text-base font-bold text-brand-navy flex items-center gap-2">
              <Map className="w-5 h-5 text-brand-teal" />
              <span>Cartography & Routing Provider Abstraction</span>
            </h2>

            <Select
              label="Selected Cartography Engine"
              value={mapsProvider}
              onChange={(e) => setMapsProvider(e.target.value)}
              options={[
                { value: 'internal_telemetry', label: 'Flowship Real-Time Vector Radar (Zero-Key Fallback)' },
                { value: 'google_maps', label: 'Google Maps Platform (Requires GOOGLE_MAPS_API_KEY in .env)' },
                { value: 'mapbox', label: 'Mapbox GL Streets (Requires MAPBOX_ACCESS_TOKEN in .env)' },
              ]}
            />
          </div>

          <div className="flex justify-end">
            <Button
              type="submit"
              variant="pill-primary"
              size="lg"
              isLoading={saving}
              leftIcon={<Save className="w-4 h-4" />}
            >
              Save System Parameters
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}
