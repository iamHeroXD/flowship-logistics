'use client';

import React, { useState } from 'react';
import { Header } from '@/components/landing/Header';
import { Footer } from '@/components/landing/Footer';
import { Input } from '@/components/ui/Input';
import { ChevronDown, Search, HelpCircle, Package, Shield, CreditCard, Truck } from 'lucide-react';

export default function FaqPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      category: 'Tracking & Telematics',
      icon: <Package className="w-4 h-4 text-brand-teal" />,
      question: 'How frequently is GPS tracking telemetry updated?',
      answer:
        'All active vehicles equipped with Flowship telemetry stream coordinates every 30 seconds while in motion. In cross-dock and warehouse terminals, optical barcode and RFID scans log milestones instantaneously.',
    },
    {
      category: 'Tracking & Telematics',
      icon: <Package className="w-4 h-4 text-brand-teal" />,
      question: 'Where can I access Proof of Delivery (POD) signatures?',
      answer:
        'Proof of Delivery is captured digitally by drivers upon handover. Customers can view and download the recipient name, timestamped geolocation, and digital signature directly inside the Tracking portal or Customer Dashboard.',
    },
    {
      category: 'Shipping & Delivery Tiers',
      icon: <Truck className="w-4 h-4 text-brand-teal" />,
      question: 'What is the cutoff time for Same-Day Urgent deliveries?',
      answer:
        'Same-Day orders placed before 1:00 PM local hub time are dispatched immediately for delivery within 6 hours across supported metropolitan corridors.',
    },
    {
      category: 'Shipping & Delivery Tiers',
      icon: <Truck className="w-4 h-4 text-brand-teal" />,
      question: 'Can I upload shipments in bulk via CSV or Excel?',
      answer:
        'Yes. Corporate and business accounts have access to our Bulk Order Engine, which validates hundreds of shipments row-by-row, previews discrepancies, and commits them in a single batch.',
    },
    {
      category: 'Payments & Invoicing',
      icon: <CreditCard className="w-4 h-4 text-brand-teal" />,
      question: 'What payment options are supported?',
      answer:
        'We support major credit/debit cards via Stripe, Paystack, Flutterwave, direct wire transfers, pre-funded corporate Flowship Wallets, and Cash on Delivery (COD) for eligible regional routes.',
    },
    {
      category: 'Enterprise Security',
      icon: <Shield className="w-4 h-4 text-brand-teal" />,
      question: 'Are shipments insured against transit loss or damage?',
      answer:
        'All shipments include automatic basic carrier liability coverage up to $100. Comprehensive all-risk freight cargo insurance can be appended during booking based on the declared package value.',
    },
  ];

  const filteredFaqs = faqs.filter(
    (f) =>
      f.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/50">
      <Header />
      <main className="flex-1 py-14 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-3xl sm:text-5xl font-extrabold text-brand-navy tracking-tight mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-slate-600 text-sm sm:text-base max-w-xl mx-auto mb-8">
              Find instant answers regarding shipping SLA, real-time telemetry, automated dispatching, and billing.
            </p>

            <div className="max-w-md mx-auto">
              <Input
                placeholder="Search questions or keywords..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                leftIcon={<Search className="w-4 h-4 text-slate-400" />}
              />
            </div>
          </div>

          <div className="space-y-4">
            {filteredFaqs.map((faq, idx) => {
              const isOpen = openIndex === idx;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden transition-all shadow-xs"
                >
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : idx)}
                    className="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-brand-surface shrink-0">{faq.icon}</div>
                      <span className="font-bold text-sm sm:text-base text-brand-navy">
                        {faq.question}
                      </span>
                    </div>
                    <ChevronDown
                      className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-brand-teal' : ''
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-6 pt-1 text-slate-600 text-sm leading-relaxed border-t border-slate-100 bg-slate-50/30">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}

            {filteredFaqs.length === 0 && (
              <div className="text-center py-12 text-slate-500 text-sm">
                No matching questions found for &ldquo;{searchTerm}&rdquo;. Try another term or contact our operations team.
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
