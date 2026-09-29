'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Header } from '@/components/landing/Header';
import { Footer } from '@/components/landing/Footer';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { useCurrency } from '@/contexts/CurrencyContext';
import { Calculator, ArrowRight, ShieldCheck, Zap, Clock, CheckCircle2 } from 'lucide-react';
import { DeliveryTier, PricingQuote } from '@/types';
import { TIER_CONFIG } from '@/lib/constants';

const CITIES = [
  { name: 'New York, NY', lat: 40.7128, lng: -74.006 },
  { name: 'Jersey City, NJ', lat: 40.7178, lng: -74.0431 },
  { name: 'Newark, NJ', lat: 40.7357, lng: -74.1724 },
  { name: 'Brooklyn, NY', lat: 40.6782, lng: -73.9442 },
  { name: 'Chicago, IL', lat: 41.8781, lng: -87.6298 },
  { name: 'Los Angeles, CA', lat: 34.0522, lng: -118.2437 },
  { name: 'Toronto, ON', lat: 43.6532, lng: -79.3832 },
];

export default function PricingPage() {
  const { format, currency } = useCurrency();

  const [originIndex, setOriginIndex] = useState('0');
  const [destIndex, setDestIndex] = useState('3');
  const [weightKg, setWeightKg] = useState('12');
  const [lengthCm, setLengthCm] = useState('40');
  const [widthCm, setWidthCm] = useState('30');
  const [heightCm, setHeightCm] = useState('25');
  const [tier, setTier] = useState<DeliveryTier>('EXPRESS');

  const [quote, setQuote] = useState<PricingQuote | null>(null);
  const [loading, setLoading] = useState(false);

  const calculate = async () => {
    setLoading(true);
    const originCity = CITIES[parseInt(originIndex)] || CITIES[0];
    const destCity = CITIES[parseInt(destIndex)] || CITIES[3];

    try {
      const res = await fetch('/api/pricing/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          origin: {
            street: originCity.name,
            city: originCity.name,
            country: 'United States',
            coordinates: { lat: originCity.lat, lng: originCity.lng },
          },
          destination: {
            street: destCity.name,
            city: destCity.name,
            country: 'United States',
            coordinates: { lat: destCity.lat, lng: destCity.lng },
          },
          packageDetails: {
            weightKg: parseFloat(weightKg) || 1,
            dimensions: {
              lengthCm: parseFloat(lengthCm) || 10,
              widthCm: parseFloat(widthCm) || 10,
              heightCm: parseFloat(heightCm) || 10,
            },
            category: 'GENERAL',
            description: 'Sample Freight',
            declaredValue: 200,
            currency: 'USD',
          },
          deliveryTier: tier,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setQuote(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    calculate();
  }, [originIndex, destIndex, weightKg, lengthCm, widthCm, heightCm, tier]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/50">
      <Header />
      <main className="flex-1 py-14 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-12 sm:mb-16">
            <h1 className="text-3xl sm:text-5xl font-extrabold text-brand-navy tracking-tight mb-4">
              Real-Time Freight Pricing Engine
            </h1>
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
              Transparent, deterministic rates based on precise geodesic mileage, cargo mass, and operational service level.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Left Calculator Form */}
            <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-subtle">
              <h2 className="text-xl font-bold text-brand-navy mb-6 flex items-center gap-2">
                <Calculator className="w-5 h-5 text-brand-teal" />
                <span>Trip & Package Parameters</span>
              </h2>

              <div className="space-y-6">
                {/* Cities */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Select
                    label="Origin Hub / City"
                    value={originIndex}
                    onChange={(e) => setOriginIndex(e.target.value)}
                    options={CITIES.map((c, i) => ({ value: i.toString(), label: c.name }))}
                  />

                  <Select
                    label="Destination Hub / City"
                    value={destIndex}
                    onChange={(e) => setDestIndex(e.target.value)}
                    options={CITIES.map((c, i) => ({ value: i.toString(), label: c.name }))}
                  />
                </div>

                {/* Weight & Dimensions */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <Input
                    label="Weight (kg)"
                    type="number"
                    value={weightKg}
                    onChange={(e) => setWeightKg(e.target.value)}
                    min="0.1"
                    step="0.5"
                  />
                  <Input
                    label="Length (cm)"
                    type="number"
                    value={lengthCm}
                    onChange={(e) => setLengthCm(e.target.value)}
                    min="1"
                  />
                  <Input
                    label="Width (cm)"
                    type="number"
                    value={widthCm}
                    onChange={(e) => setWidthCm(e.target.value)}
                    min="1"
                  />
                  <Input
                    label="Height (cm)"
                    type="number"
                    value={heightCm}
                    onChange={(e) => setHeightCm(e.target.value)}
                    min="1"
                  />
                </div>

                {/* Service Tier Selection */}
                <div>
                  <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block mb-2">
                    Delivery Speed Tier
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {(Object.keys(TIER_CONFIG) as DeliveryTier[]).map((tKey) => {
                      const tInfo = TIER_CONFIG[tKey];
                      const isSelected = tier === tKey;
                      return (
                        <div
                          key={tKey}
                          onClick={() => setTier(tKey)}
                          className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                            isSelected
                              ? 'border-brand-teal bg-brand-surface ring-2 ring-brand-teal/20'
                              : 'border-slate-200 hover:border-slate-300 bg-white'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-bold text-sm text-brand-navy">{tInfo.label}</span>
                            <span className="text-[11px] font-semibold text-brand-teal bg-white px-2 py-0.5 rounded-full border border-slate-200">
                              {tInfo.speed}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 leading-snug">{tInfo.desc}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Quote Summary Card */}
            <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-elevated">
              <h3 className="text-lg font-bold text-brand-navy mb-4">Estimated Rate Breakdown</h3>

              {quote ? (
                <div className="space-y-4">
                  <div className="p-4 bg-brand-surface rounded-2xl flex items-baseline justify-between">
                    <div>
                      <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
                        Total Estimated Cost
                      </span>
                      <div className="text-3xl sm:text-4xl font-extrabold text-brand-navy mt-1">
                        {format(quote.total)}
                      </div>
                    </div>
                    <span className="text-xs font-mono text-slate-500">
                      Currency: {currency}
                    </span>
                  </div>

                  <dl className="space-y-2.5 text-xs sm:text-sm text-slate-600 pt-2">
                    <div className="flex justify-between">
                      <dt>Base Logistics Booking Fee</dt>
                      <dd className="font-semibold text-slate-900">{format(quote.basePrice)}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt>Distance Linehaul ({quote.distanceKm} km)</dt>
                      <dd className="font-semibold text-slate-900">{format(quote.distanceFee)}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt>Chargeable Weight Fee</dt>
                      <dd className="font-semibold text-slate-900">{format(quote.weightFee)}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt>Zone Transit Surcharge</dt>
                      <dd className="font-semibold text-slate-900">{format(quote.zoneSurcharge)}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt>Energy / Fuel Surcharge</dt>
                      <dd className="font-semibold text-slate-900">{format(quote.fuelSurcharge)}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt>Applicable VAT / Regional Tax</dt>
                      <dd className="font-semibold text-slate-900">{format(quote.tax)}</dd>
                    </div>
                  </dl>

                  <div className="pt-4 border-t border-slate-100 flex flex-col gap-3">
                    <Link
                      href={`/dashboard/shipments/new?origin=${encodeURIComponent(
                        CITIES[parseInt(originIndex)]?.name || ''
                      )}&dest=${encodeURIComponent(
                        CITIES[parseInt(destIndex)]?.name || ''
                      )}&tier=${tier}&weight=${weightKg}`}
                    >
                      <Button variant="pill-primary" size="lg" className="w-full">
                        <span>Book Shipment with this Quote &rarr;</span>
                      </Button>
                    </Link>

                    <div className="flex items-center justify-center gap-2 text-[11px] text-slate-500 text-center">
                      <ShieldCheck className="w-3.5 h-3.5 text-brand-mint shrink-0" />
                      <span>Guaranteed rate with zero surprise terminal surcharges</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-12 text-center text-slate-400 text-sm">
                  Calculating real-time telemetry quote...
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
