'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';

export const CtaBanner: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section className="py-16 sm:py-20 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Organic curved pill container matching Screenshot 3 */}
        <div className="bg-[#dbeef5] rounded-[48px] sm:rounded-full px-8 py-10 sm:px-14 sm:py-12 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xs border border-[#cfe2eb]">
          <div className="text-center md:text-left">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-navy tracking-tight mb-2">
              {t.cta.title}
            </h2>
            <p className="text-sm sm:text-base text-slate-700 font-medium">
              {t.cta.subtitle}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
            <Link
              href="/pricing"
              className="px-6 py-3 rounded-full bg-white text-brand-navy font-semibold text-sm hover:bg-slate-50 transition-all shadow-xs"
            >
              {t.cta.getQuote}
            </Link>
            <Link
              href="/contact"
              className="px-6 py-3 rounded-full bg-transparent text-brand-navy border border-slate-700/40 font-semibold text-sm hover:bg-black/5 transition-all"
            >
              {t.cta.talkExpert}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
