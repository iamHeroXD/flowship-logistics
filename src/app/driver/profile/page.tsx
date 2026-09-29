'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Truck, Award, ShieldCheck, Phone, Mail, FileBadge } from 'lucide-react';

export default function DriverProfilePage() {
  return (
    <div className="p-4 sm:p-6 max-w-lg mx-auto w-full space-y-6">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <Link
          href="/driver"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Cockpit</span>
        </Link>
        <h1 className="text-sm font-extrabold text-white uppercase tracking-wider">
          Driver Dossier
        </h1>
      </div>

      {/* Driver Identity Card */}
      <div className="bg-slate-800 rounded-3xl p-6 border border-slate-700 text-center space-y-3">
        <div className="w-20 h-20 rounded-full bg-brand-teal text-white flex items-center justify-center font-bold text-2xl mx-auto border-2 border-emerald-400">
          CM
        </div>
        <div>
          <h2 className="text-lg font-black text-white">Carlos Mendoza</h2>
          <p className="text-xs text-emerald-400 font-bold uppercase tracking-wider mt-0.5">
            Senior Linehaul Courier &bull; 4.95 &#9733; Rating
          </p>
        </div>
        <div className="flex items-center justify-center gap-4 text-xs text-slate-400 pt-2 border-t border-slate-700/80">
          <span>1,248 Deliveries</span>
          <span>&bull;</span>
          <span>99.8% On-Time SLA</span>
        </div>
      </div>

      {/* Credentials */}
      <div className="bg-slate-800 rounded-3xl p-5 border border-slate-700 text-xs space-y-3">
        <h3 className="font-bold text-white uppercase tracking-wider text-[11px] mb-2 flex items-center gap-1.5">
          <FileBadge className="w-4 h-4 text-emerald-400" />
          <span>Verified Operating Credentials</span>
        </h3>
        <div className="flex justify-between text-slate-300">
          <span className="text-slate-400">Commercial License (CDL):</span>
          <strong className="font-mono text-white">CDL-NY-89104</strong>
        </div>
        <div className="flex justify-between text-slate-300">
          <span className="text-slate-400">DOT Safety Certification:</span>
          <strong className="text-emerald-400">ACTIVE &bull; Class A/B</strong>
        </div>
        <div className="flex justify-between text-slate-300">
          <span className="text-slate-400">Direct Dispatch Hotline:</span>
          <strong className="text-white">+1 (555) 456-7890</strong>
        </div>
      </div>

      {/* Assigned Vehicle */}
      <div className="bg-slate-800 rounded-3xl p-5 border border-slate-700 text-xs space-y-3">
        <h3 className="font-bold text-white uppercase tracking-wider text-[11px] mb-2 flex items-center gap-1.5">
          <Truck className="w-4 h-4 text-emerald-400" />
          <span>Assigned Fleet Vehicle</span>
        </h3>
        <div className="flex justify-between text-slate-300">
          <span className="text-slate-400">Model:</span>
          <strong className="text-white">Ford E-Transit Electric Van (2025)</strong>
        </div>
        <div className="flex justify-between text-slate-300">
          <span className="text-slate-400">Plate Number:</span>
          <strong className="font-mono text-emerald-400">FS-982-NY</strong>
        </div>
        <div className="flex justify-between text-slate-300">
          <span className="text-slate-400">Max Weight Capacity:</span>
          <strong className="font-mono text-white">1,650 kg</strong>
        </div>
        <div className="flex justify-between text-slate-300">
          <span className="text-slate-400">Next Service Inspection:</span>
          <strong className="text-white">August 15, 2026</strong>
        </div>
      </div>
    </div>
  );
}
