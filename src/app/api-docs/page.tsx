'use client';

import React, { useState } from 'react';
import { Header } from '@/components/landing/Header';
import { Footer } from '@/components/landing/Footer';
import { Code, Key, Copy, Check, Terminal, Shield } from 'lucide-react';
import { useToast } from '@/contexts/ToastContext';

export default function ApiDocsPage() {
  const { success } = useToast();
  const [copiedEndpoint, setCopiedEndpoint] = useState<string | null>(null);

  const copyToClipboard = (text: string, endpoint: string) => {
    navigator.clipboard.writeText(text);
    setCopiedEndpoint(endpoint);
    success('Copied code snippet to clipboard');
    setTimeout(() => setCopiedEndpoint(null), 2000);
  };

  const endpoints = [
    {
      method: 'GET',
      path: '/api/tracking/{trackingNumber}',
      title: 'Query Real-Time Telemetry by Tracking Number',
      desc: 'Retrieves current shipment status, live coordinates, milestone events, and driver telemetry.',
      curl: `curl -X GET "http://localhost:3000/api/tracking/FLW-2026-89421" \\
  -H "Authorization: Bearer flw_live_demo_key"`,
      response: `{
  "success": true,
  "data": {
    "trackingNumber": "FLW-2026-89421",
    "status": "IN_TRANSIT",
    "origin": { "city": "Jersey City", "street": "725 Gateway Blvd" },
    "destination": { "city": "New York", "street": "180 Varick St" },
    "deliveryTier": "EXPRESS",
    "estimatedDeliveryTime": "2026-09-28T18:30:00Z"
  }
}`,
    },
    {
      method: 'POST',
      path: '/api/pricing/calculate',
      title: 'Instant Rate Quote Calculation',
      desc: 'Calculates deterministic freight fees based on geodesic distance, cargo mass, volumetric dimensions, and service tier.',
      curl: `curl -X POST "http://localhost:3000/api/pricing/calculate" \\
  -H "Content-Type: application/json" \\
  -d '{
    "origin": { "city": "New York", "coordinates": { "lat": 40.7128, "lng": -74.006 } },
    "destination": { "city": "Brooklyn", "coordinates": { "lat": 40.6782, "lng": -73.9442 } },
    "packageDetails": { "weightKg": 15, "dimensions": { "lengthCm": 40, "widthCm": 30, "heightCm": 20 } },
    "deliveryTier": "EXPRESS"
  }'`,
      response: `{
  "success": true,
  "data": {
    "basePrice": 25.00,
    "distanceKm": 12.4,
    "distanceFee": 18.60,
    "weightFee": 12.00,
    "total": 68.45,
    "currency": "USD"
  }
}`,
    },
    {
      method: 'POST',
      path: '/api/shipments',
      title: 'Create and Dispatch New Shipment',
      desc: 'Creates a verified shipment order, calculates fees, books payment, and triggers dispatch pipeline.',
      curl: `curl -X POST "http://localhost:3000/api/shipments" \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer flw_live_demo_key" \\
  -d '{
    "recipientName": "Acme Industries",
    "origin": { "street": "450 Lexington Ave", "city": "New York" },
    "destination": { "street": "120 Industry City", "city": "Brooklyn" },
    "weightKg": 25,
    "deliveryTier": "SAME_DAY"
  }'`,
      response: `{
  "success": true,
  "data": {
    "id": "shp_17275000",
    "trackingNumber": "FLW-2026-90214",
    "status": "PENDING"
  }
}`,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/50">
      <Header />
      <main className="flex-1 py-14 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-surface text-brand-teal text-xs font-bold uppercase tracking-wider mb-3 border border-slate-200">
              <Terminal className="w-3.5 h-3.5" />
              <span>Developer Reference</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-brand-navy tracking-tight mb-4">
              Flowship REST API Specifications
            </h1>
            <p className="text-slate-600 text-sm sm:text-base max-w-2xl leading-relaxed">
              Integrate enterprise shipping, automated dispatching, rate calculations, and telemetry directly into your ERP, WMS, or e-commerce storefront.
            </p>
          </div>

          {/* Authentication Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-subtle mb-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 text-brand-navy font-bold text-base mb-1">
                <Shield className="w-5 h-5 text-brand-teal" />
                <span>API Key Authentication</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500">
                All authorized requests require your organization API key passed via the standard HTTP Bearer token header.
              </p>
            </div>
            <div className="bg-slate-900 text-emerald-400 font-mono text-xs px-4 py-3 rounded-xl border border-slate-800 flex items-center gap-3">
              <span>Authorization: Bearer flw_live_demo_key</span>
            </div>
          </div>

          {/* Endpoints List */}
          <div className="space-y-8">
            {endpoints.map((ep, idx) => (
              <div
                key={idx}
                className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-subtle"
              >
                <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <span
                      className={`px-3 py-1 rounded-lg font-mono text-xs font-bold ${
                        ep.method === 'GET'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {ep.method}
                    </span>
                    <span className="font-mono text-sm sm:text-base font-bold text-slate-900">
                      {ep.path}
                    </span>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-brand-navy mb-1">{ep.title}</h3>
                <p className="text-xs sm:text-sm text-slate-600 mb-6">{ep.desc}</p>

                {/* Code Tabs */}
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-2">
                      <span>Example cURL Request</span>
                      <button
                        onClick={() => copyToClipboard(ep.curl, `curl_${idx}`)}
                        className="text-brand-teal hover:text-brand-navy flex items-center gap-1 font-sans transition-colors"
                      >
                        {copiedEndpoint === `curl_${idx}` ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span className="text-emerald-600">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy cURL</span>
                          </>
                        )}
                      </button>
                    </div>
                    <pre className="p-4 bg-slate-900 text-slate-100 rounded-2xl text-xs font-mono overflow-x-auto">
                      <code>{ep.curl}</code>
                    </pre>
                  </div>

                  <div>
                    <div className="text-xs font-semibold text-slate-500 mb-2">Response JSON (200 OK)</div>
                    <pre className="p-4 bg-slate-900 text-emerald-400 rounded-2xl text-xs font-mono overflow-x-auto">
                      <code>{ep.response}</code>
                    </pre>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
