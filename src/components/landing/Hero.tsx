'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, HelpCircle } from 'lucide-react';
import { TrackingWidget } from './TrackingWidget';
import { APP_CONFIG } from '@/lib/constants';
import { useLanguage } from '@/contexts/LanguageContext';

export const Hero: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28">
      {/* Subtle background ambient light */}
      <div className="absolute top-0 right-1/4 -z-10 w-96 h-96 bg-brand-surface rounded-full blur-3xl opacity-60" />
      <div className="absolute top-1/2 left-0 -z-10 w-72 h-72 bg-brand-surface-alt rounded-full blur-3xl opacity-40" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Copy & Actions */}
          <div className="lg:col-span-7 flex flex-col items-start">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-brand-navy tracking-tight leading-[1.12] mb-6">
              {t.hero.headline}
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl mb-9">
              {t.hero.subtitle}
            </p>

            {/* CTAs matching screenshot */}
            <div className="flex flex-wrap items-center gap-4 mb-14">
              <Link
                href="/dashboard/shipments/new"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-brand-teal text-white font-medium hover:bg-brand-teal-hover transition-all shadow-sm hover:shadow"
              >
                <span>{t.hero.startShipping}</span>
              </Link>

              <Link
                href="/about#how-it-works"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white text-brand-navy font-medium border border-slate-200 hover:bg-slate-50 transition-all shadow-xs"
              >
                <HelpCircle className="w-4 h-4 text-slate-400" />
                <span>{t.hero.howItWorks}</span>
              </Link>
            </div>

            {/* Key Operational Metrics */}
            <div className="grid grid-cols-3 gap-6 sm:gap-10 pt-4 border-t border-slate-100 w-full max-w-md">
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-brand-navy">
                  {APP_CONFIG.operationalStats.onTimeRate}
                </div>
                <div className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
                  {t.hero.onTime}
                </div>
              </div>

              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-brand-navy">
                  {APP_CONFIG.operationalStats.activeShipments}
                </div>
                <div className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
                  {t.hero.activeShipments}
                </div>
              </div>

              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-brand-navy">
                  {APP_CONFIG.operationalStats.liveSupport}
                </div>
                <div className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
                  {t.hero.liveSupport}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Tracking Interface Widget */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <TrackingWidget />
          </div>
        </div>
      </div>
    </section>
  );
};
