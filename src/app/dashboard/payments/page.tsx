'use client';

import React, { useState } from 'react';
import { DashboardHeader } from '@/components/layout/DashboardHeader';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { useCurrency } from '@/contexts/CurrencyContext';
import { useToast } from '@/contexts/ToastContext';
import { Wallet, CreditCard, PlusCircle, ArrowUpRight, ArrowDownLeft, ShieldCheck } from 'lucide-react';

export default function PaymentsPage() {
  const { format } = useCurrency();
  const { success, error } = useToast();

  const [walletBalance, setWalletBalance] = useState(14250.0);
  const [topUpOpen, setTopUpOpen] = useState(false);
  const [amount, setAmount] = useState('2500');

  const handleTopUp = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(amount);
    if (isNaN(val) || val <= 0) {
      error('Please enter a valid amount.');
      return;
    }
    setWalletBalance((prev) => prev + val);
    setTopUpOpen(false);
    success(`Successfully credited ${format(val)} to corporate wallet!`);
  };

  const transactions = [
    {
      id: 'tx_01',
      desc: 'Freight Dispatch FLW-2026-89421 (Express NYC)',
      amount: -120.8,
      date: '2026-09-28 14:00',
      type: 'DEBIT',
    },
    {
      id: 'tx_02',
      desc: 'Freight Dispatch FLW-2026-10293 (Same-Day Manhattan)',
      amount: -140.1,
      date: '2026-09-28 11:00',
      type: 'DEBIT',
    },
    {
      id: 'tx_03',
      desc: 'Corporate Wallet Automated Wire Deposit',
      amount: 15000.0,
      date: '2026-09-25 09:30',
      type: 'CREDIT',
    },
  ];

  return (
    <>
      <DashboardHeader
        title="Wallet & Payment Management"
        subtitle="Manage company shipping credit, pre-funded wallets, and payment gateways."
      />

      <div className="p-6 sm:p-8 max-w-5xl mx-auto space-y-8">
        {/* Wallet Overview Banner */}
        <div className="bg-brand-navy text-white rounded-3xl p-8 shadow-elevated flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400 mb-1">
              <Wallet className="w-4 h-4" />
              <span>Available Corporate Balance</span>
            </div>
            <div className="text-4xl font-black mt-1">{format(walletBalance)}</div>
            <p className="text-xs text-slate-300 mt-2">
              Credit Limit: $150,000.00 &bull; Auto-billing linked to Apex Robotics B2B account
            </p>
          </div>

          <Button
            variant="pill-primary"
            onClick={() => setTopUpOpen(true)}
            className="bg-emerald-500 hover:bg-emerald-600 text-brand-navy font-bold"
            leftIcon={<PlusCircle className="w-4 h-4" />}
          >
            Add Funds to Wallet
          </Button>
        </div>

        {/* Saved Payment Methods */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-subtle space-y-4">
          <h2 className="text-lg font-bold text-brand-navy">Authorized Payment Methods</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl border border-brand-teal/40 bg-brand-surface flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white shadow-xs flex items-center justify-center text-brand-navy">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-bold text-brand-navy">Corporate Visa &bull;&bull;&bull;&bull; 4242</div>
                  <div className="text-xs text-slate-500">Expires 12/28 &bull; Default</div>
                </div>
              </div>
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-full">
                Verified
              </span>
            </div>

            <div className="p-5 rounded-2xl border border-slate-200 bg-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-600">
                  <Wallet className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-bold text-brand-navy">Chase Business ACH Wire</div>
                  <div className="text-xs text-slate-500">Routing &bull;&bull;&bull;&bull; 8912</div>
                </div>
              </div>
              <span className="text-[11px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">
                Active
              </span>
            </div>
          </div>
        </div>

        {/* Transaction History */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-subtle overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <h3 className="text-base font-bold text-brand-navy">Recent Wallet Transactions</h3>
          </div>

          <div className="divide-y divide-slate-100 text-xs sm:text-sm font-medium">
            {transactions.map((tx) => (
              <div key={tx.id} className="p-4 sm:px-6 flex items-center justify-between hover:bg-slate-50">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                      tx.type === 'CREDIT'
                        ? 'bg-emerald-50 text-emerald-600'
                        : 'bg-rose-50 text-rose-600'
                    }`}
                  >
                    {tx.type === 'CREDIT' ? (
                      <ArrowDownLeft className="w-4 h-4" />
                    ) : (
                      <ArrowUpRight className="w-4 h-4" />
                    )}
                  </div>
                  <div>
                    <div className="text-slate-900 font-semibold">{tx.desc}</div>
                    <div className="text-[11px] text-slate-400">{tx.date}</div>
                  </div>
                </div>

                <div
                  className={`font-mono font-bold ${
                    tx.type === 'CREDIT' ? 'text-emerald-600' : 'text-slate-900'
                  }`}
                >
                  {tx.type === 'CREDIT' ? `+${format(tx.amount)}` : format(Math.abs(tx.amount))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Up Modal */}
      <Modal isOpen={topUpOpen} onClose={() => setTopUpOpen(false)} title="Fund Corporate Wallet">
        <form onSubmit={handleTopUp} className="space-y-4">
          <p className="text-xs text-slate-500">
            Funds will be instantly debited from your primary bank account and added to your available shipping credit.
          </p>
          <Input
            label="Amount to Deposit ($ USD)"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            min="100"
            step="100"
            required
          />
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" type="button" onClick={() => setTopUpOpen(false)}>
              Cancel
            </Button>
            <Button variant="pill-primary" type="submit">
              Confirm & Deposit
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
