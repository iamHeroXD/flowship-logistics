'use client';

import React, { useState } from 'react';
import { DashboardHeader } from '@/components/layout/DashboardHeader';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { User, MapPin, Bell, Shield, Key, Save } from 'lucide-react';

export default function SettingsPage() {
  const { user } = useAuth();
  const { success } = useToast();

  const [name, setName] = useState(user?.name || 'Elena Rostova');
  const [email, setEmail] = useState(user?.email || 'customer@flowship.com');
  const [phone, setPhone] = useState(user?.phone || '+1 (555) 234-8901');

  const [emailNotifs, setEmailNotifs] = useState(true);
  const [smsNotifs, setSmsNotifs] = useState(true);
  const [autoInvoice, setAutoInvoice] = useState(true);

  const [saving, setSaving] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      success('Account preferences saved successfully.');
    }, 500);
  };

  return (
    <>
      <DashboardHeader
        title="Settings & Shipper Profile"
        subtitle="Manage personal identity, verified communications channels, and saved hub addresses."
      />

      <div className="p-6 sm:p-8 max-w-4xl mx-auto space-y-8">
        <form onSubmit={handleSave} className="space-y-8">
          {/* Identity Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-subtle space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-brand-surface text-brand-teal">
                <User className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-brand-navy">Personal & Corporate Identity</h2>
                <p className="text-xs text-slate-500">Official contact credentials for freight consignments.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <Input
                label="Registered Work Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Input
                label="Contact Phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
              <Input
                label="Assigned Organization"
                value="Apex Robotics International (biz_01)"
                disabled
              />
            </div>
          </div>

          {/* Saved Addresses */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-subtle space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-brand-surface text-brand-teal">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-brand-navy">Default Origin Warehouses</h2>
                <p className="text-xs text-slate-500">Pre-saved dispatch terminals for 1-click booking.</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-900">Manhattan Distribution Office</div>
                  <div className="text-xs text-slate-500">450 Lexington Avenue, New York, NY 10017</div>
                </div>
                <span className="text-[10px] font-bold text-brand-teal bg-brand-surface px-2.5 py-1 rounded-full uppercase border border-slate-200">
                  Primary Hub
                </span>
              </div>

              <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-900">Brooklyn Fulfillment Annex</div>
                  <div className="text-xs text-slate-500">120 Industry City Way, Brooklyn, NY 11232</div>
                </div>
                <span className="text-[10px] font-bold text-slate-500 bg-slate-200 px-2.5 py-1 rounded-full uppercase">
                  Secondary
                </span>
              </div>
            </div>
          </div>

          {/* Notification Preferences */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-subtle space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-brand-surface text-brand-teal">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-brand-navy">Notification Channels</h2>
                <p className="text-xs text-slate-500">Configure event alerts and automated dispatch telemetry.</p>
              </div>
            </div>

            <div className="space-y-3">
              <label className="flex items-center justify-between p-3.5 rounded-2xl border border-slate-100 bg-slate-50/50 cursor-pointer">
                <div>
                  <div className="text-xs font-bold text-slate-900">Email Milestone Notifications</div>
                  <div className="text-[11px] text-slate-500">Receive departure, transit, and arrival emails.</div>
                </div>
                <input
                  type="checkbox"
                  checked={emailNotifs}
                  onChange={(e) => setEmailNotifs(e.target.checked)}
                  className="rounded text-brand-teal focus:ring-brand-teal"
                />
              </label>

              <label className="flex items-center justify-between p-3.5 rounded-2xl border border-slate-100 bg-slate-50/50 cursor-pointer">
                <div>
                  <div className="text-xs font-bold text-slate-900">SMS Driver ETA Alerts</div>
                  <div className="text-[11px] text-slate-500">Instant SMS when driver is within 15 minutes of destination.</div>
                </div>
                <input
                  type="checkbox"
                  checked={smsNotifs}
                  onChange={(e) => setSmsNotifs(e.target.checked)}
                  className="rounded text-brand-teal focus:ring-brand-teal"
                />
              </label>

              <label className="flex items-center justify-between p-3.5 rounded-2xl border border-slate-100 bg-slate-50/50 cursor-pointer">
                <div>
                  <div className="text-xs font-bold text-slate-900">Automated PDF Invoices</div>
                  <div className="text-[11px] text-slate-500">Dispatch tax receipts directly to accounts payable.</div>
                </div>
                <input
                  type="checkbox"
                  checked={autoInvoice}
                  onChange={(e) => setAutoInvoice(e.target.checked)}
                  className="rounded text-brand-teal focus:ring-brand-teal"
                />
              </label>
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              type="submit"
              variant="pill-primary"
              size="lg"
              isLoading={saving}
              leftIcon={<Save className="w-4 h-4" />}
            >
              Save Preferences
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}
