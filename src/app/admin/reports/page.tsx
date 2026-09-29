'use client';

import React, { useState } from 'react';
import { DashboardHeader } from '@/components/layout/DashboardHeader';
import { Button } from '@/components/ui/Button';
import { useCurrency } from '@/contexts/CurrencyContext';
import { useToast } from '@/contexts/ToastContext';
import { BarChart3, Download, Calendar, TrendingUp, CheckCircle2, Clock } from 'lucide-react';

export default function AdminReportsPage() {
  const { format } = useCurrency();
  const { success } = useToast();
  const [period, setPeriod] = useState('30D');

  const exportReport = () => {
    const csvData = `Report,Flowship Operational Performance Report (${period})
Metric,Value
Gross Invoiced Revenue,$148,220.00
Completed Consignments,2,840
On-Time SLA Delivery Rate,99.4%
Average Courier Transit Time,42 mins
Active Fleets In Service,38 units`;

    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `flowship_performance_report_${period}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    success('Exported performance report CSV');
  };

  return (
    <>
      <DashboardHeader
        title="Operational & Financial Reports"
        subtitle="Exportable performance telemetry, on-time SLA audits, and freight volume analytics."
      />

      <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-8">
        {/* Controls */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-subtle flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            {['7D', '30D', '90D', 'YTD'].map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                  period === p
                    ? 'bg-brand-navy text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {p === '7D' ? 'Last 7 Days' : p === '30D' ? 'Last 30 Days' : p === '90D' ? 'Last Quarter' : 'Year to Date'}
              </button>
            ))}
          </div>

          <Button
            variant="pill-primary"
            size="sm"
            onClick={exportReport}
            leftIcon={<Download className="w-4 h-4" />}
          >
            Export Comprehensive CSV Report
          </Button>
        </div>

        {/* Analytics Breakdown Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-subtle space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              SLA Compliance
            </span>
            <div className="text-4xl font-black text-brand-navy">99.4%</div>
            <p className="text-xs text-slate-500">
              Deliveries executed strictly within customer agreement windows.
            </p>
            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full" style={{ width: '99.4%' }} />
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-subtle space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Average Urban Turnaround
            </span>
            <div className="text-4xl font-black text-brand-navy">42 min</div>
            <p className="text-xs text-slate-500">
              Elapsed time between dispatcher confirmation and courier pickup.
            </p>
            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-brand-teal rounded-full" style={{ width: '85%' }} />
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-subtle space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Customer Re-Order Rate
            </span>
            <div className="text-4xl font-black text-brand-navy">94.8%</div>
            <p className="text-xs text-slate-500">
              Enterprise accounts booking recurring weekly freight linehauls.
            </p>
            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 rounded-full" style={{ width: '94.8%' }} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
