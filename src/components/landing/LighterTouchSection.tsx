'use client';

import React from 'react';
import { CheckCircle2, Star } from 'lucide-react';
import { APP_CONFIG } from '@/lib/constants';

export const LighterTouchSection: React.FC = () => {
  const bulletFeatures = [
    'Real-time tracking & predictive ETAs',
    'Many shipping options',
    'Dedicated account manager',
    'Fleet Management',
    'Seamless API & platform integrations',
  ];

  return (
    <section className="py-20 bg-slate-50/60 border-y border-slate-100/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column matching Screenshot 2 */}
          <div className="lg:col-span-6">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-brand-navy tracking-tight mb-4">
              Logistics with a lighter touch
            </h2>
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed mb-8">
              We use smart routing backed by real people to keep your goods moving smoothly — so you can focus on what matters the most
            </p>

            <ul className="space-y-4">
              {bulletFeatures.map((feat, idx) => (
                <li key={idx} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full border-2 border-brand-mint flex items-center justify-center shrink-0">
                    <div className="w-2 h-2 rounded-full bg-brand-mint" />
                  </div>
                  <span className="text-sm sm:text-base font-medium text-slate-700">{feat}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right Column: Three Organic Pebble Metric Badges matching Screenshot 2 */}
          <div className="lg:col-span-6 flex flex-wrap sm:flex-nowrap items-center justify-center gap-5 sm:gap-6">
            {/* Metric 1 */}
            <div className="w-full sm:w-44 bg-white rounded-[32px_12px_32px_12px] p-6 sm:p-7 shadow-subtle border border-slate-100 flex flex-col items-center text-center">
              <span className="text-3xl sm:text-4xl font-extrabold text-brand-navy mb-2">
                {APP_CONFIG.operationalStats.countriesServed}
              </span>
              <span className="text-xs sm:text-sm font-medium text-slate-500">
                Countries served
              </span>
            </div>

            {/* Metric 2 */}
            <div className="w-full sm:w-44 bg-white rounded-[12px_32px_12px_32px] p-6 sm:p-7 shadow-subtle border border-slate-100 flex flex-col items-center text-center">
              <span className="text-3xl sm:text-4xl font-extrabold text-brand-navy mb-2">
                {APP_CONFIG.operationalStats.shipmentsYearly}
              </span>
              <span className="text-xs sm:text-sm font-medium text-slate-500">
                Shipments yearly
              </span>
            </div>

            {/* Metric 3 with Star icon */}
            <div className="w-full sm:w-44 bg-white rounded-[32px_12px_32px_12px] p-6 sm:p-7 shadow-subtle border border-slate-100 flex flex-col items-center text-center">
              <div className="flex items-center gap-1 text-3xl sm:text-4xl font-extrabold text-brand-navy mb-2">
                <span>4.9</span>
                <Star className="w-6 h-6 fill-brand-navy text-brand-navy" />
              </div>
              <span className="text-xs sm:text-sm font-medium text-slate-500">
                Client rating
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
