'use client';

import React, { useState, useEffect } from 'react';
import { DashboardHeader } from '@/components/layout/DashboardHeader';
import { Button } from '@/components/ui/Button';
import { useCurrency } from '@/contexts/CurrencyContext';
import { useToast } from '@/contexts/ToastContext';
import { BusinessAccount } from '@/types';
import { Building2, Key, ShieldCheck, Copy, Check, Users } from 'lucide-react';

export default function AdminBusinessesPage() {
  const { format } = useCurrency();
  const { success } = useToast();
  const [businesses, setBusinesses] = useState<BusinessAccount[]>([]);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  useEffect(() => {
    // In production from db.getBusinesses()
    setBusinesses([
      {
        id: 'biz_01',
        name: 'Apex Robotics International',
        industry: 'Advanced Automation & Hardware',
        contactEmail: 'logistics@apexrobotics.io',
        billingEmail: 'ap@apexrobotics.io',
        phone: '+1 (555) 998-1122',
        creditLimit: 150000.0,
        balance: 14250.0,
        currency: 'USD',
        apiKey: 'flw_live_9a8f27c81d3e4b77a0',
        plan: 'ENTERPRISE_CUSTOM',
        membersCount: 14,
        createdAt: '2025-06-10T10:00:00Z',
      },
      {
        id: 'biz_02',
        name: 'Nordic Clean Technologies',
        industry: 'Renewable Power Equipment',
        contactEmail: 'freight@nordiccleantech.se',
        billingEmail: 'finance@nordiccleantech.se',
        phone: '+1 (555) 774-8833',
        creditLimit: 80000.0,
        balance: 6400.0,
        currency: 'USD',
        apiKey: 'flw_live_44b2a891e0ccf382a9',
        plan: 'GROWTH_TIER',
        membersCount: 6,
        createdAt: '2025-11-20T11:30:00Z',
      },
    ]);
  }, []);

  const copyApiKey = (key: string, id: string) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(id);
    success('API key copied to clipboard');
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <>
      <DashboardHeader
        title="Corporate & B2B Business Accounts"
        subtitle="Manage multi-tenant business organizations, credit limits, and developer API credentials."
      />

      <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {businesses.map((biz) => (
            <div
              key={biz.id}
              className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-subtle space-y-5"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-brand-teal bg-brand-surface px-2.5 py-0.5 rounded-full border border-slate-200">
                      {biz.plan.replace(/_/g, ' ')}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">ID: {biz.id}</span>
                  </div>
                  <h3 className="text-xl font-bold text-brand-navy">{biz.name}</h3>
                  <p className="text-xs text-slate-500">{biz.industry}</p>
                </div>

                <div className="w-10 h-10 rounded-xl bg-brand-surface text-brand-teal flex items-center justify-center shrink-0">
                  <Building2 className="w-5 h-5" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs pt-4 border-t border-slate-100">
                <div>
                  <span className="text-slate-400 block mb-0.5">Approved Credit Limit:</span>
                  <span className="text-base font-extrabold text-brand-navy font-mono">
                    {format(biz.creditLimit)}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Available Balance:</span>
                  <span className="text-base font-extrabold text-emerald-600 font-mono">
                    {format(biz.balance)}
                  </span>
                </div>
              </div>

              {/* API Key management */}
              <div className="p-3.5 bg-slate-900 rounded-2xl border border-slate-800 flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-2 overflow-hidden text-emerald-400">
                  <Key className="w-4 h-4 shrink-0 text-slate-400" />
                  <span className="truncate">{biz.apiKey}</span>
                </div>
                <button
                  onClick={() => copyApiKey(biz.apiKey, biz.id)}
                  className="ml-3 p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors shrink-0"
                  title="Copy API key"
                >
                  {copiedKey === biz.id ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
                <div className="flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-slate-400" />
                  <span>{biz.membersCount} Authorized Team Members</span>
                </div>
                <span>Billing: {biz.billingEmail}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
