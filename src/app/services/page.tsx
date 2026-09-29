'use client';

import React from 'react';
import Link from 'next/link';
import { Header } from '@/components/landing/Header';
import { Footer } from '@/components/landing/Footer';
import { PebbleCard } from '@/components/ui/PebbleCard';
import { Button } from '@/components/ui/Button';
import {
  Compass,
  Warehouse,
  Plane,
  Clock,
  Boxes,
  ThermometerSnowflake,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';

export default function ServicesPage() {
  const serviceList = [
    {
      id: 'road-rail',
      icon: <Compass className="w-6 h-6 text-brand-teal" />,
      title: 'Road & Rail Freight',
      desc: 'Ground freight through trucking across borders and rail transportation. Optimized for full truckload (FTL) and less-than-truckload (LTL) with continuous GPS telematics.',
      badge: 'Intermodal Logistics',
      specs: ['GPS Geofence Alerts', 'Cross-Border Customs', 'Reefer & Dry Vans'],
    },
    {
      id: 'warehousing',
      icon: <Warehouse className="w-6 h-6 text-brand-teal" />,
      title: 'Warehousing & Fulfillment',
      desc: 'Sophisticated fulfillment facilities with real-time inventory control, barcode bin tracking, SKU-level reserve & release, and automated dispatch capabilities.',
      badge: 'Fulfillment Hubs',
      specs: ['WMS Integration', 'Bonded Storage Zones', 'Same-Day Cross-Docking'],
    },
    {
      id: 'air-ocean',
      icon: <Plane className="w-6 h-6 text-brand-teal" />,
      title: 'Air & Ocean Cargo',
      desc: 'High-speed intercontinental air freight charters and containerized ocean linehauls backed by port handling agreements and electronic customs declarations.',
      badge: 'Global Freight',
      specs: ['Charter & Scheduled Air', 'FCL & LCL Ocean', 'Port-to-Door Delivery'],
    },
    {
      id: 'express',
      icon: <Clock className="w-6 h-6 text-brand-teal" />,
      title: 'Express & Same-Day Courier',
      desc: 'Point-to-point urban express courier operations. Real-time courier dispatching, direct route navigation, digital signature capture, and photo proof of delivery.',
      badge: 'Urban SLA < 6h',
      specs: ['Dedicated Dispatch', 'Digital Signatures', 'Photo POD Verification'],
    },
    {
      id: 'bulk',
      icon: <Boxes className="w-6 h-6 text-brand-teal" />,
      title: 'Enterprise Bulk Distribution',
      desc: 'High-volume recurring distribution for retail chains, manufacturers, and eCommerce distributors. Includes CSV/Excel bulk upload and automated order batching.',
      badge: 'B2B Distribution',
      specs: ['Automated CSV Import', 'Volume Rate Discounts', 'Dedicated Account Manager'],
    },
    {
      id: 'cold-chain',
      icon: <ThermometerSnowflake className="w-6 h-6 text-brand-teal" />,
      title: 'Pharmaceutical Cold-Chain',
      desc: 'Certified climate-controlled logistics for sensitive biotechnology, pharmaceuticals, and temperature-sensitive biological materials with uncompromised integrity.',
      badge: 'Cold Chain',
      specs: ['-20°C to +4°C Monitored', 'GDP Compliant Packaging', 'Telemetry Audits'],
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-1 py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="max-w-3xl mx-auto text-center mb-16 sm:mb-20">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-brand-navy tracking-tight mb-4">
              Comprehensive Logistics Solutions
            </h1>
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
              From localized point-to-point express couriers to multi-modal cross-border freight networks, Flowship powers your modern supply chain.
            </p>
          </div>

          {/* Grid of Pebble Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
            {serviceList.map((svc, idx) => (
              <div
                key={svc.id}
                id={svc.id}
                className="bg-brand-surface rounded-[32px] p-8 border border-slate-100 flex flex-col justify-between hover:shadow-subtle hover:bg-brand-surface-alt/80 transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-full bg-white shadow-xs flex items-center justify-center border border-slate-100">
                      {svc.icon}
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-brand-teal bg-white/80 px-3 py-1 rounded-full border border-slate-200/50">
                      {svc.badge}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-brand-navy mb-3">{svc.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed mb-6">{svc.desc}</p>
                </div>

                <div>
                  <ul className="space-y-2 mb-6 border-t border-slate-200/60 pt-4">
                    {svc.specs.map((spec, sIdx) => (
                      <li key={sIdx} className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-brand-mint shrink-0" />
                        <span>{spec}</span>
                      </li>
                    ))}
                  </ul>

                  <Link
                    href={`/pricing?tier=${encodeURIComponent(svc.title)}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-teal hover:text-brand-teal-hover transition-colors"
                  >
                    <span>Calculate Rates</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Enterprise CTA */}
          <div className="bg-brand-navy text-white rounded-[36px] p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-xl">
              <h2 className="text-2xl sm:text-3xl font-extrabold mb-3">
                Need customized enterprise supply chain SLA?
              </h2>
              <p className="text-sm sm:text-base text-slate-300">
                Our operations team designs tailored logistics networks for multinational enterprises with custom warehouse routing and volume discounts.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-4 shrink-0">
              <Link href="/contact">
                <Button variant="pill-primary" className="bg-brand-mint hover:bg-emerald-600 text-brand-navy font-bold">
                  Schedule Operations Audit
                </Button>
              </Link>
              <Link href="/pricing">
                <Button variant="pill-secondary">Explore Pricing Calculator</Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
