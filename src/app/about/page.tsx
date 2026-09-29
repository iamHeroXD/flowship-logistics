'use client';

import React from 'react';
import Link from 'next/link';
import { Header } from '@/components/landing/Header';
import { Footer } from '@/components/landing/Footer';
import { Button } from '@/components/ui/Button';
import { APP_CONFIG } from '@/lib/constants';
import { ShieldCheck, Globe2, Award, Truck, Users, Cpu, ArrowRight } from 'lucide-react';

export default function AboutPage() {
  const pillars = [
    {
      icon: <Cpu className="w-6 h-6 text-brand-teal" />,
      title: 'Precision Telematics',
      desc: 'Our proprietary telemetry layer streams millisecond updates directly from vehicle sensors and automated cross-dock scanners.',
    },
    {
      icon: <Globe2 className="w-6 h-6 text-brand-teal" />,
      title: 'Global Operating Footprint',
      desc: 'Over 54 countries connected through synchronized air lanes, rail corridors, and bonded metropolitan logistics terminals.',
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-brand-teal" />,
      title: 'Guaranteed SLAs',
      desc: 'We back our standard, express, and same-day delivery SLAs with automated restitution and transparent performance reporting.',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-1 py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="max-w-3xl mx-auto text-center mb-16 sm:mb-20">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-mint bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 inline-block mb-3">
              About Flowship Logistics
            </span>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-brand-navy tracking-tight mb-6">
              Engineering the Operating System for Modern Freight
            </h1>
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
              Founded to eliminate friction from fragmented global transport, Flowship combines physical asset excellence with high-fidelity telemetry.
            </p>
          </div>

          {/* Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            {pillars.map((pillar, idx) => (
              <div
                key={idx}
                className="bg-brand-surface rounded-[32px] p-8 border border-slate-100 hover:shadow-subtle transition-all"
              >
                <div className="w-12 h-12 rounded-full bg-white shadow-xs flex items-center justify-center mb-6 border border-slate-100">
                  {pillar.icon}
                </div>
                <h3 className="text-xl font-bold text-brand-navy mb-3">{pillar.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{pillar.desc}</p>
              </div>
            ))}
          </div>

          {/* Infrastructure Metrics */}
          <div className="bg-brand-navy text-white rounded-[36px] p-8 sm:p-14 mb-20">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-3xl sm:text-4xl font-extrabold text-emerald-400">54+</div>
                <div className="text-xs sm:text-sm text-slate-300 mt-1">Countries Connected</div>
              </div>
              <div>
                <div className="text-3xl sm:text-4xl font-extrabold text-emerald-400">2.8M</div>
                <div className="text-xs sm:text-sm text-slate-300 mt-1">Shipments Handled Yearly</div>
              </div>
              <div>
                <div className="text-3xl sm:text-4xl font-extrabold text-emerald-400">99.4%</div>
                <div className="text-xs sm:text-sm text-slate-300 mt-1">On-Time SLA Delivery</div>
              </div>
              <div>
                <div className="text-3xl sm:text-4xl font-extrabold text-emerald-400">100%</div>
                <div className="text-xs sm:text-sm text-slate-300 mt-1">Carbon-Offset Fleet Options</div>
              </div>
            </div>
          </div>

          {/* How It Works Section */}
          <div id="how-it-works" className="max-w-4xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-navy text-center mb-12">
              How Flowship Orchestrates Every Mile
            </h2>

            <div className="space-y-8">
              {[
                {
                  step: '01',
                  title: 'Instant Booking & Electronic Waybill',
                  desc: 'Quote accurately across weight, dimensions, and speed tier. Receive instant carrier-compliant documentation.',
                },
                {
                  step: '02',
                  title: 'Automated Fleet & Corridor Dispatch',
                  desc: 'Our dispatching engine pairs your load with an optimal vehicle and vetted driver based on current capacity and routing telemetry.',
                },
                {
                  step: '03',
                  title: 'Live Geofence Telemetry & In-Transit Updates',
                  desc: 'Follow your cargo across every milestone with millimeter-accurate GPS coordinates and proactive ETA recalculations.',
                },
                {
                  step: '04',
                  title: 'Verified Proof of Delivery & Instant Invoicing',
                  desc: 'Drivers capture electronic signatures and photo evidence upon dropoff. Invoices and receipts generate deterministically.',
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-6 p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs"
                >
                  <span className="text-2xl font-black text-brand-teal font-mono shrink-0">
                    {item.step}
                  </span>
                  <div>
                    <h3 className="text-lg font-bold text-brand-navy mb-1">{item.title}</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
