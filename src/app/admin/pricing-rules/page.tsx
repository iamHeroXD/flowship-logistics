'use client';

import React, { useState } from 'react';
import { DashboardHeader } from '@/components/layout/DashboardHeader';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useToast } from '@/contexts/ToastContext';
import { Sliders, Save, ShieldCheck } from 'lucide-react';

export default function AdminPricingRulesPage() {
  const { success } = useToast();

  const [baseRate, setBaseRate] = useState('25.00');
  const [perKmRate, setPerKmRate] = useState('1.50');
  const [perKgRate, setPerKgRate] = useState('0.80');

  const [tierSameDay, setTierSameDay] = useState('1.9');
  const [tierExpress, setTierExpress] = useState('1.4');
  const [tierStandard, setTierStandard] = useState('1.0');
  const [tierScheduled, setTierScheduled] = useState('1.2');

  const [zoneMetro, setZoneMetro] = useState('5.00');
  const [zoneRegional, setZoneRegional] = useState('12.00');
  const [zoneCrossBorder, setZoneCrossBorder] = useState('35.00');

  const [fuelSurcharge, setFuelSurcharge] = useState('5.0');
  const [taxPercent, setTaxPercent] = useState('8.25');

  const [saving, setSaving] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      success('Dynamic pricing rules updated and synchronized across all quoting endpoints.');
    }, 500);
  };

  return (
    <>
      <DashboardHeader
        title="Dynamic Pricing Rules Configuration"
        subtitle="Calibrate geodesic linehaul rates, volumetric multipliers, and regional zone tariffs."
      />

      <div className="p-6 sm:p-8 max-w-4xl mx-auto space-y-8">
        <form onSubmit={handleSave} className="space-y-8">
          {/* Base Rates */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-subtle space-y-6">
            <h2 className="text-base font-bold text-brand-navy flex items-center gap-2">
              <Sliders className="w-5 h-5 text-brand-teal" />
              <span>Base Freight Rates ($ USD)</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Input
                label="Base Booking Fare ($)"
                type="number"
                step="0.5"
                value={baseRate}
                onChange={(e) => setBaseRate(e.target.value)}
                required
              />
              <Input
                label="Per Kilometer Rate ($/km)"
                type="number"
                step="0.1"
                value={perKmRate}
                onChange={(e) => setPerKmRate(e.target.value)}
                required
              />
              <Input
                label="Per Kilogram Mass Rate ($/kg)"
                type="number"
                step="0.05"
                value={perKgRate}
                onChange={(e) => setPerKgRate(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Service SLA Tier Multipliers */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-subtle space-y-6">
            <h2 className="text-base font-bold text-brand-navy">Service SLA Multipliers</h2>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <Input
                label="Standard (1.0x)"
                type="number"
                step="0.05"
                value={tierStandard}
                onChange={(e) => setTierStandard(e.target.value)}
                required
              />
              <Input
                label="Scheduled (1.2x)"
                type="number"
                step="0.05"
                value={tierScheduled}
                onChange={(e) => setTierScheduled(e.target.value)}
                required
              />
              <Input
                label="Express Priority (1.4x)"
                type="number"
                step="0.05"
                value={tierExpress}
                onChange={(e) => setTierExpress(e.target.value)}
                required
              />
              <Input
                label="Same-Day Urgent (1.9x)"
                type="number"
                step="0.05"
                value={tierSameDay}
                onChange={(e) => setTierSameDay(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Regional Zone Surcharges */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-subtle space-y-6">
            <h2 className="text-base font-bold text-brand-navy">Zone Routing Surcharges ($)</h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Input
                label="Urban Metro Zone ($)"
                type="number"
                value={zoneMetro}
                onChange={(e) => setZoneMetro(e.target.value)}
                required
              />
              <Input
                label="Regional Interstate ($)"
                type="number"
                value={zoneRegional}
                onChange={(e) => setZoneRegional(e.target.value)}
                required
              />
              <Input
                label="Cross-Border Customs ($)"
                type="number"
                value={zoneCrossBorder}
                onChange={(e) => setZoneCrossBorder(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Fuel and Tax */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-subtle space-y-6">
            <h2 className="text-base font-bold text-brand-navy">Regulatory Tax & Energy Surcharge (%)</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Fuel & Energy Surcharge (%)"
                type="number"
                step="0.1"
                value={fuelSurcharge}
                onChange={(e) => setFuelSurcharge(e.target.value)}
                required
              />
              <Input
                label="Regional Sales Tax / VAT (%)"
                type="number"
                step="0.05"
                value={taxPercent}
                onChange={(e) => setTaxPercent(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              type="submit"
              variant="pill-primary"
              size="lg"
              isLoading={saving}
              leftIcon={<Save className="w-4 h-4" />}
            >
              Update Global Pricing Engine
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}
