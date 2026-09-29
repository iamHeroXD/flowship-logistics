'use client';

import React, { useState } from 'react';
import { Header } from '@/components/landing/Header';
import { Footer } from '@/components/landing/Footer';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/contexts/ToastContext';
import { Mail, Phone, MapPin, Send, MessageSquare, Clock } from 'lucide-react';
import { APP_CONFIG } from '@/lib/constants';

export default function ContactPage() {
  const { success, error } = useToast();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [department, setDepartment] = useState('ENTERPRISE_SALES');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      error('Please complete all required fields.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      success('Thank you! Your inquiry has been routed to our operations specialists.');
      setName('');
      setEmail('');
      setMessage('');
    }, 600);
  };

  const offices = [
    {
      city: 'New York Headquarters',
      address: '450 Lexington Avenue, 18th Floor, New York, NY 10017',
      phone: '+1 (800) 555-FLOW',
      email: 'nyc@flowship.com',
    },
    {
      city: 'Chicago Intermodal Hub',
      address: '2200 Rail Freight Way, Chicago, IL 60608',
      phone: '+1 (312) 555-8910',
      email: 'midwest@flowship.com',
    },
    {
      city: 'London European Gateway',
      address: '10 St Mary Axe, City of London, EC3A 8EP',
      phone: '+44 20 7946 0991',
      email: 'europe@flowship.com',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/50">
      <Header />
      <main className="flex-1 py-14 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-12 sm:mb-16">
            <h1 className="text-3xl sm:text-5xl font-extrabold text-brand-navy tracking-tight mb-4">
              Get in Touch with Flowship
            </h1>
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
              Have questions regarding enterprise freight contracts, API integrations, or active shipments? Our operations team is online 24/7.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Contact Form */}
            <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-subtle">
              <h2 className="text-xl font-bold text-brand-navy mb-6 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-brand-teal" />
                <span>Send Operations an Inquiry</span>
              </h2>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Full Name"
                    placeholder="e.g. Rachel Adams"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                  <Input
                    label="Business Email"
                    type="email"
                    placeholder="rachel@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <Select
                  label="Target Department"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  options={[
                    { value: 'ENTERPRISE_SALES', label: 'Enterprise Supply Chain & Volume Quotes' },
                    { value: 'DISPATCH_OPERATIONS', label: 'Active Shipment & Driver Operations' },
                    { value: 'API_INTEGRATIONS', label: 'Developer API & EDI Integrations' },
                    { value: 'BILLING_INVOICING', label: 'Invoicing & Corporate Credit' },
                  ]}
                />

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Message / Cargo Specifications
                  </label>
                  <textarea
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Describe your shipping requirements, volume expectations, or specific inquiry..."
                    className="w-full bg-white border border-slate-200 text-slate-900 text-sm rounded-xl p-3.5 focus:outline-none focus:border-brand-teal focus:ring-2 focus:ring-brand-teal/15 transition-all"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  variant="pill-primary"
                  size="lg"
                  isLoading={isSubmitting}
                  leftIcon={<Send className="w-4 h-4" />}
                >
                  Send Inquiry
                </Button>
              </form>
            </div>

            {/* Office Hubs */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-brand-navy text-white rounded-3xl p-6 sm:p-8 shadow-elevated">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-emerald-400" />
                  <span>24/7 Operations Desk</span>
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed mb-6">
                  For active shipment emergencies, re-routing, or urgent driver dispatch updates, call our toll-free operations hotline anytime.
                </p>
                <div className="flex items-center gap-3 p-4 bg-slate-800/80 rounded-2xl border border-slate-700">
                  <Phone className="w-5 h-5 text-emerald-400" />
                  <div>
                    <div className="text-xs text-slate-400">Emergency Freight Hotline</div>
                    <div className="text-base font-bold text-white">{APP_CONFIG.phone}</div>
                  </div>
                </div>
              </div>

              {/* Physical Locations */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-subtle space-y-5">
                <h3 className="text-base font-bold text-brand-navy">Global Logistics Terminals</h3>
                {offices.map((off, idx) => (
                  <div key={idx} className="border-b border-slate-100 pb-4 last:border-none last:pb-0">
                    <h4 className="font-bold text-sm text-brand-navy">{off.city}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">{off.address}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-brand-teal font-medium">
                      <span>{off.phone}</span>
                      <span>&bull;</span>
                      <span>{off.email}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
