'use client';

import React from 'react';
import Link from 'next/link';
import { Compass, Warehouse, Plane, Clock, ArrowRight } from 'lucide-react';
import { PebbleCard } from '@/components/ui/PebbleCard';

export const ServicesSection: React.FC = () => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading matching screenshot */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-brand-navy tracking-tight mb-4">
            Logistics that fits your flow
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            From first mile to final delivery — we make every step simple, visible and efficient
          </p>
        </div>

        {/* Services Cards with Organic Pebble Shapes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
          {/* Card 1: Road & rail matching screenshot 2 */}
          <PebbleCard
            asymmetric="left"
            icon={<Compass className="w-6 h-6 text-brand-teal" />}
            title="Road & rail"
            description="Ground freight through trucking across borders and rail transportation with telemetry-monitored corridor transit."
          >
            <div className="mt-8 pt-6 border-t border-slate-200/60 flex items-center justify-between text-xs text-slate-500">
              <span className="font-semibold text-brand-navy">FTL & LTL Available</span>
              <Link
                href="/services#road-rail"
                className="inline-flex items-center gap-1 font-semibold text-brand-teal hover:text-brand-teal-hover transition-colors"
              >
                <span>Learn more</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </PebbleCard>

          {/* Card 2: Warehousing matching screenshot 2 */}
          <PebbleCard
            asymmetric="right"
            icon={<Warehouse className="w-6 h-6 text-brand-teal" />}
            title="Warehousing"
            description="Sophisticated fulfillment facilities with real-time inventory control, bonded storage zones, and same-day shipping capability."
          >
            <div className="mt-8 pt-6 border-t border-slate-200/60 flex items-center justify-between text-xs text-slate-500">
              <span className="font-semibold text-brand-navy">Climate Controlled & Bonded</span>
              <Link
                href="/services#warehousing"
                className="inline-flex items-center gap-1 font-semibold text-brand-teal hover:text-brand-teal-hover transition-colors"
              >
                <span>Learn more</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </PebbleCard>

          {/* Card 3: Air & Maritime Freight */}
          <PebbleCard
            asymmetric="right"
            icon={<Plane className="w-6 h-6 text-brand-teal" />}
            title="Air & Ocean Freight"
            description="Intercontinental expedited air charters and containerized ocean lanes backed by direct customs clearance integration."
          >
            <div className="mt-8 pt-6 border-t border-slate-200/60 flex items-center justify-between text-xs text-slate-500">
              <span className="font-semibold text-brand-navy">Global Port Clearance</span>
              <Link
                href="/services#air-ocean"
                className="inline-flex items-center gap-1 font-semibold text-brand-teal hover:text-brand-teal-hover transition-colors"
              >
                <span>Learn more</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </PebbleCard>

          {/* Card 4: Express Last-Mile Courier */}
          <PebbleCard
            asymmetric="left"
            icon={<Clock className="w-6 h-6 text-brand-teal" />}
            title="Express & Same-Day"
            description="Dedicated urban couriers executing sub-6-hour deliveries with digital signatures and photo proof of delivery."
          >
            <div className="mt-8 pt-6 border-t border-slate-200/60 flex items-center justify-between text-xs text-slate-500">
              <span className="font-semibold text-brand-navy">Under 6h SLA Guarantee</span>
              <Link
                href="/services#express"
                className="inline-flex items-center gap-1 font-semibold text-brand-teal hover:text-brand-teal-hover transition-colors"
              >
                <span>Learn more</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </PebbleCard>
        </div>
      </div>
    </section>
  );
};
