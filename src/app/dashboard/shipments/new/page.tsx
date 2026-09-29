'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { DashboardHeader } from '@/components/layout/DashboardHeader';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { useToast } from '@/contexts/ToastContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import { DeliveryTier, PaymentMethod, PricingQuote, Shipment } from '@/types';
import { TIER_CONFIG } from '@/lib/constants';
import {
  MapPin,
  Package,
  Clock,
  DollarSign,
  CreditCard,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Building,
} from 'lucide-react';

function NewShipmentContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { success, error } = useToast();
  const { format } = useCurrency();

  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Step 1: Addresses
  const [pickupStreet, setPickupStreet] = useState('450 Lexington Avenue');
  const [pickupCity, setPickupCity] = useState(searchParams.get('origin') || 'New York');
  const [pickupPostal, setPickupPostal] = useState('10017');
  const [deliveryStreet, setDeliveryStreet] = useState('180 Varick Street, 9th Floor');
  const [deliveryCity, setDeliveryCity] = useState(searchParams.get('dest') || 'New York');
  const [deliveryPostal, setDeliveryPostal] = useState('10014');

  // Step 2: Package
  const [weightKg, setWeightKg] = useState(searchParams.get('weight') || '8.5');
  const [lengthCm, setLengthCm] = useState('40');
  const [widthCm, setWidthCm] = useState('30');
  const [heightCm, setHeightCm] = useState('20');
  const [category, setCategory] = useState<'ELECTRONICS' | 'DOCUMENTS' | 'PERISHABLE' | 'GENERAL' | 'FRAGILE'>('ELECTRONICS');
  const [description, setDescription] = useState('High-Precision Sensors in protective crate');
  const [declaredValue, setDeclaredValue] = useState('1500');

  // Step 3: Delivery Tier
  const [tier, setTier] = useState<DeliveryTier>((searchParams.get('tier') as DeliveryTier) || 'EXPRESS');
  const [specialInstructions, setSpecialInstructions] = useState('Call recipient upon arrival at freight bay');

  // Step 4: Pricing Quote
  const [quote, setQuote] = useState<PricingQuote | null>(null);

  // Step 5: Payment
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('CARD');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('889');

  // Step 6: Confirmation
  const [createdShipment, setCreatedShipment] = useState<Shipment | null>(null);

  const fetchQuote = async () => {
    try {
      const res = await fetch('/api/pricing/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          origin: {
            street: pickupStreet,
            city: pickupCity,
            postalCode: pickupPostal,
            country: 'United States',
            coordinates: { lat: 40.7527, lng: -73.9772 },
          },
          destination: {
            street: deliveryStreet,
            city: deliveryCity,
            postalCode: deliveryPostal,
            country: 'United States',
            coordinates: { lat: 40.7275, lng: -74.0049 },
          },
          packageDetails: {
            weightKg: parseFloat(weightKg) || 1,
            dimensions: {
              lengthCm: parseFloat(lengthCm) || 10,
              widthCm: parseFloat(widthCm) || 10,
              heightCm: parseFloat(heightCm) || 10,
            },
            category,
            description,
            declaredValue: parseFloat(declaredValue) || 100,
            currency: 'USD',
          },
          deliveryTier: tier,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setQuote(data.data);
      }
    } catch {
      error('Error calculating rate quote.');
    }
  };

  const handleNextStep = async () => {
    if (step === 1) {
      if (!pickupStreet || !pickupCity || !deliveryStreet || !deliveryCity) {
        error('Please complete all origin and destination address fields.');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!weightKg || parseFloat(weightKg) <= 0) {
        error('Please enter a valid cargo weight.');
        return;
      }
      setStep(3);
    } else if (step === 3) {
      await fetchQuote();
      setStep(4);
    } else if (step === 4) {
      setStep(5);
    } else if (step === 5) {
      // Submit order
      setIsSubmitting(true);
      try {
        const res = await fetch('/api/shipments', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            origin: {
              street: pickupStreet,
              city: pickupCity,
              postalCode: pickupPostal,
              country: 'United States',
              coordinates: { lat: 40.7527, lng: -73.9772 },
            },
            destination: {
              street: deliveryStreet,
              city: deliveryCity,
              postalCode: deliveryPostal,
              country: 'United States',
              coordinates: { lat: 40.7275, lng: -74.0049 },
            },
            packageDetails: {
              weightKg: parseFloat(weightKg),
              dimensions: {
                lengthCm: parseFloat(lengthCm),
                widthCm: parseFloat(widthCm),
                heightCm: parseFloat(heightCm),
              },
              category,
              description,
              declaredValue: parseFloat(declaredValue),
              currency: 'USD',
            },
            deliveryTier: tier,
            paymentMethod,
            specialInstructions,
          }),
        });

        const data = await res.json();
        if (data.success && data.data) {
          setCreatedShipment(data.data);
          setStep(6);
          success(`Shipment ${data.data.trackingNumber} successfully booked and dispatched!`);
        } else {
          error(data.error?.message || 'Failed to create shipment.');
        }
      } catch {
        error('Connection error submitting shipment.');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const steps = [
    { num: 1, label: 'Addresses' },
    { num: 2, label: 'Package' },
    { num: 3, label: 'Service Tier' },
    { num: 4, label: 'Quote' },
    { num: 5, label: 'Payment' },
    { num: 6, label: 'Confirmation' },
  ];

  return (
    <>
      <DashboardHeader
        title="Book New Freight Shipment"
        subtitle="6-step guided dispatch workflow with instant electronic waybill registration."
      />

      <div className="p-6 sm:p-8 max-w-4xl mx-auto space-y-8">
        {/* Step Indicator Progress Bar */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-subtle">
          <div className="flex items-center justify-between">
            {steps.map((s, idx) => {
              const isCompleted = step > s.num;
              const isCurrent = step === s.num;
              return (
                <div key={s.num} className="flex items-center flex-1 last:flex-none">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                        isCompleted
                          ? 'bg-brand-mint text-white'
                          : isCurrent
                          ? 'bg-brand-teal text-white ring-4 ring-brand-teal/20'
                          : 'bg-slate-100 text-slate-400'
                      }`}
                    >
                      {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : s.num}
                    </div>
                    <span
                      className={`text-[11px] font-semibold mt-1 hidden sm:block ${
                        isCurrent ? 'text-brand-navy' : 'text-slate-400'
                      }`}
                    >
                      {s.label}
                    </span>
                  </div>
                  {idx < steps.length - 1 && (
                    <div
                      className={`h-0.5 flex-1 mx-2 sm:mx-3 transition-colors ${
                        step > s.num ? 'bg-brand-mint' : 'bg-slate-200'
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Wizard Form Body */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-elevated">
          {/* STEP 1: Addresses */}
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <h2 className="text-xl font-bold text-brand-navy flex items-center gap-2">
                <MapPin className="w-5 h-5 text-brand-teal" />
                <span>Origin & Destination Addresses</span>
              </h2>

              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Pickup Location
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <Input
                      label="Street Address"
                      value={pickupStreet}
                      onChange={(e) => setPickupStreet(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Input
                      label="City"
                      value={pickupCity}
                      onChange={(e) => setPickupCity(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-slate-100">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Delivery Destination
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <Input
                      label="Street Address"
                      value={deliveryStreet}
                      onChange={(e) => setDeliveryStreet(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Input
                      label="City"
                      value={deliveryCity}
                      onChange={(e) => setDeliveryCity(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Package */}
          {step === 2 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <h2 className="text-xl font-bold text-brand-navy flex items-center gap-2">
                <Package className="w-5 h-5 text-brand-teal" />
                <span>Package & Cargo Specifications</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Select
                  label="Cargo Category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  options={[
                    { value: 'ELECTRONICS', label: 'Electronics & High-Value Hardware' },
                    { value: 'DOCUMENTS', label: 'Certified Documents & Legal Briefs' },
                    { value: 'GENERAL', label: 'General Freight & Retail Goods' },
                    { value: 'PERISHABLE', label: 'Perishable / Climate-Controlled' },
                    { value: 'FRAGILE', label: 'Fragile / Calibrated Instrumentation' },
                  ]}
                />

                <Input
                  label="Declared Commercial Value ($ USD)"
                  type="number"
                  value={declaredValue}
                  onChange={(e) => setDeclaredValue(e.target.value)}
                  min="1"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <Input
                  label="Gross Weight (kg)"
                  type="number"
                  value={weightKg}
                  onChange={(e) => setWeightKg(e.target.value)}
                  min="0.1"
                  step="0.5"
                  required
                />
                <Input
                  label="Length (cm)"
                  type="number"
                  value={lengthCm}
                  onChange={(e) => setLengthCm(e.target.value)}
                />
                <Input
                  label="Width (cm)"
                  type="number"
                  value={widthCm}
                  onChange={(e) => setWidthCm(e.target.value)}
                />
                <Input
                  label="Height (cm)"
                  type="number"
                  value={heightCm}
                  onChange={(e) => setHeightCm(e.target.value)}
                />
              </div>

              <Input
                label="Cargo Description / Contents"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g. Server components in sealed anti-static bags"
                required
              />
            </div>
          )}

          {/* STEP 3: Delivery Tier */}
          {step === 3 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <h2 className="text-xl font-bold text-brand-navy flex items-center gap-2">
                <Clock className="w-5 h-5 text-brand-teal" />
                <span>Select Service Level Agreement (SLA)</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {(Object.keys(TIER_CONFIG) as DeliveryTier[]).map((tKey) => {
                  const tInfo = TIER_CONFIG[tKey];
                  const isSelected = tier === tKey;
                  return (
                    <div
                      key={tKey}
                      onClick={() => setTier(tKey)}
                      className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'border-brand-teal bg-brand-surface ring-2 ring-brand-teal/20'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-base text-brand-navy">{tInfo.label}</span>
                        <span className="text-xs font-semibold text-brand-teal bg-white px-2.5 py-0.5 rounded-full border border-slate-200">
                          {tInfo.speed}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 leading-relaxed">{tInfo.desc}</p>
                    </div>
                  );
                })}
              </div>

              <Input
                label="Driver / Handling Instructions (Optional)"
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                placeholder="e.g. Dock 4 pickup, ring buzzer on arrival"
              />
            </div>
          )}

          {/* STEP 4: Pricing Breakdown */}
          {step === 4 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <h2 className="text-xl font-bold text-brand-navy flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-brand-teal" />
                <span>Itemized Telemetry Quote</span>
              </h2>

              {quote ? (
                <div className="space-y-4">
                  <div className="p-6 bg-brand-surface rounded-2xl flex items-baseline justify-between border border-slate-200/80">
                    <div>
                      <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
                        Total Payable Fare
                      </span>
                      <div className="text-4xl font-extrabold text-brand-navy mt-1">
                        {format(quote.total)}
                      </div>
                    </div>
                    <span className="text-xs text-emerald-800 font-semibold bg-emerald-100/60 px-3 py-1 rounded-full">
                      Guaranteed Rate Lock
                    </span>
                  </div>

                  <dl className="space-y-2 text-sm text-slate-600 divide-y divide-slate-100">
                    <div className="flex justify-between py-2">
                      <dt>Base Logistics Booking Fee</dt>
                      <dd className="font-semibold text-slate-900">{format(quote.basePrice)}</dd>
                    </div>
                    <div className="flex justify-between py-2">
                      <dt>Linehaul Distance ({quote.distanceKm} km)</dt>
                      <dd className="font-semibold text-slate-900">{format(quote.distanceFee)}</dd>
                    </div>
                    <div className="flex justify-between py-2">
                      <dt>Cargo Weight Handling Fee</dt>
                      <dd className="font-semibold text-slate-900">{format(quote.weightFee)}</dd>
                    </div>
                    <div className="flex justify-between py-2">
                      <dt>Zone & Urban Routing Surcharge</dt>
                      <dd className="font-semibold text-slate-900">{format(quote.zoneSurcharge)}</dd>
                    </div>
                    <div className="flex justify-between py-2">
                      <dt>Energy / Fuel Surcharge</dt>
                      <dd className="font-semibold text-slate-900">{format(quote.fuelSurcharge)}</dd>
                    </div>
                    <div className="flex justify-between py-2">
                      <dt>Taxes & Regulatory Fees</dt>
                      <dd className="font-semibold text-slate-900">{format(quote.tax)}</dd>
                    </div>
                  </dl>
                </div>
              ) : (
                <div className="py-8 text-center text-slate-400">Loading quote calculation...</div>
              )}
            </div>
          )}

          {/* STEP 5: Payment */}
          {step === 5 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <h2 className="text-xl font-bold text-brand-navy flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-brand-teal" />
                <span>Select Payment Method</span>
              </h2>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { id: 'CARD', label: 'Credit Card', icon: '💳' },
                  { id: 'WALLET', label: 'Flowship Wallet', icon: '💰' },
                  { id: 'BANK_TRANSFER', label: 'Wire Transfer', icon: '🏛️' },
                  { id: 'CASH_ON_DELIVERY', label: 'Cash On Delivery', icon: '📦' },
                ].map((m) => (
                  <div
                    key={m.id}
                    onClick={() => setPaymentMethod(m.id as PaymentMethod)}
                    className={`p-4 rounded-2xl border text-center cursor-pointer transition-all ${
                      paymentMethod === m.id
                        ? 'border-brand-teal bg-brand-surface ring-2 ring-brand-teal/20 font-bold'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="text-2xl mb-1">{m.icon}</div>
                    <div className="text-xs text-brand-navy">{m.label}</div>
                  </div>
                ))}
              </div>

              {paymentMethod === 'CARD' && (
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                  <Input
                    label="Card Number"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      label="Expiry Date"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                    />
                    <Input
                      label="CVC / CVV"
                      value={cardCvc}
                      onChange={(e) => setCardCvc(e.target.value)}
                    />
                  </div>
                </div>
              )}

              {paymentMethod === 'WALLET' && (
                <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-900">
                  <span className="font-bold">Available Corporate Balance: $14,250.00</span>
                  <p className="mt-1 text-emerald-700">Amount will be debited instantly from Apex Robotics master account.</p>
                </div>
              )}
            </div>
          )}

          {/* STEP 6: Confirmation */}
          {step === 6 && createdShipment && (
            <div className="text-center py-6 space-y-6 animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <span className="text-xs uppercase font-bold text-brand-teal tracking-wider">
                  Waybill Manifest Registered
                </span>
                <h2 className="text-3xl font-extrabold text-brand-navy mt-1">
                  {createdShipment.trackingNumber}
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Estimated delivery by {new Date(createdShipment.estimatedDeliveryTime).toLocaleTimeString()}
                </p>
              </div>

              <div className="max-w-md mx-auto p-4 bg-slate-50 rounded-2xl border border-slate-200 text-left text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Origin:</span>
                  <span className="font-semibold text-slate-900">{createdShipment.origin.city}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Destination:</span>
                  <span className="font-semibold text-slate-900">{createdShipment.destination.city}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Service SLA:</span>
                  <span className="font-semibold text-slate-900">{createdShipment.deliveryTier}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Total Paid:</span>
                  <span className="font-semibold text-brand-teal">${createdShipment.pricing.total.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3">
                <Button
                  variant="pill-primary"
                  onClick={() => router.push(`/dashboard/shipments/${createdShipment.id}`)}
                >
                  View Shipment Details
                </Button>
                <Button
                  variant="pill-secondary"
                  onClick={() => router.push(`/tracking?id=${createdShipment.trackingNumber}`)}
                >
                  Live Telemetry Map
                </Button>
              </div>
            </div>
          )}

          {/* Action Buttons Footer */}
          {step < 6 && (
            <div className="flex items-center justify-between pt-8 border-t border-slate-100 mt-8">
              {step > 1 ? (
                <Button
                  variant="outline"
                  size="md"
                  onClick={() => setStep((s) => s - 1)}
                  leftIcon={<ArrowLeft className="w-4 h-4" />}
                >
                  Back
                </Button>
              ) : (
                <div />
              )}

              <Button
                variant="pill-primary"
                size="md"
                onClick={handleNextStep}
                isLoading={isSubmitting}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                {step === 5 ? 'Confirm & Authorize Dispatch' : 'Continue'}
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default function NewShipmentPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-slate-500">Loading booking wizard...</div>}>
      <NewShipmentContent />
    </Suspense>
  );
}
