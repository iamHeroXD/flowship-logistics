import React from 'react';
import Link from 'next/link';
import { Truck, Home, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-slate-50 text-center">
      <div className="w-16 h-16 rounded-2xl bg-brand-surface border border-slate-200 flex items-center justify-center text-brand-teal mb-6 shadow-xs">
        <Truck className="w-8 h-8 text-brand-teal" />
      </div>

      <span className="text-sm font-mono font-bold text-brand-teal bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 mb-3">
        404 — WAYPOINT NOT FOUND
      </span>

      <h1 className="text-3xl sm:text-4xl font-extrabold text-brand-navy tracking-tight mb-3">
        Route Disconnected
      </h1>

      <p className="text-sm sm:text-base text-slate-600 max-w-md mb-8">
        The coordinates or portal page you requested does not exist or has been relocated to another logistics hub.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link href="/">
          <Button variant="pill-primary" leftIcon={<Home className="w-4 h-4" />}>
            Return to Homepage
          </Button>
        </Link>
        <Link href="/tracking">
          <Button variant="pill-secondary" leftIcon={<ArrowLeft className="w-4 h-4" />}>
            Track a Shipment
          </Button>
        </Link>
      </div>
    </div>
  );
}
