'use client';

import React from 'react';
import Link from 'next/link';
import { Truck, Linkedin, Instagram, Twitter, Github } from 'lucide-react';
import { APP_CONFIG } from '@/lib/constants';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-slate-100 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12">
          {/* Brand Column matching Screenshot 3 */}
          <div className="md:col-span-5 flex flex-col items-start">
            <Link href="/" className="flex items-center gap-2.5 mb-4 group">
              <div className="w-8 h-8 rounded-lg bg-brand-surface flex items-center justify-center text-brand-mint border border-slate-200/60">
                <Truck className="w-5 h-5 text-brand-mint" />
              </div>
              <span className="text-lg font-bold text-brand-navy tracking-tight">
                Flowship Logistics
              </span>
            </Link>
            <p className="text-sm text-slate-500 max-w-sm mb-6 leading-relaxed">
              {APP_CONFIG.tagline}
            </p>
          </div>

          {/* Navigation Columns matching Screenshot 3 */}
          <div className="md:col-span-7 grid grid-cols-3 gap-8">
            <div>
              <h4 className="text-sm font-bold text-brand-navy mb-4">Services</h4>
              <ul className="space-y-2.5 text-sm text-slate-500">
                <li>
                  <Link href="/services#road-rail" className="hover:text-brand-navy transition-colors">
                    Road & rail
                  </Link>
                </li>
                <li>
                  <Link href="/services#warehousing" className="hover:text-brand-navy transition-colors">
                    Warehousing
                  </Link>
                </li>
                <li>
                  <Link href="/services#air-ocean" className="hover:text-brand-navy transition-colors">
                    Air & Ocean
                  </Link>
                </li>
                <li>
                  <Link href="/services#express" className="hover:text-brand-navy transition-colors">
                    Express Courier
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-bold text-brand-navy mb-4">Company</h4>
              <ul className="space-y-2.5 text-sm text-slate-500">
                <li>
                  <Link href="/about" className="hover:text-brand-navy transition-colors">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/about#careers" className="hover:text-brand-navy transition-colors">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="/about#press" className="hover:text-brand-navy transition-colors">
                    Press
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-brand-navy transition-colors">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-bold text-brand-navy mb-4">Resources</h4>
              <ul className="space-y-2.5 text-sm text-slate-500">
                <li>
                  <Link href="/tracking" className="hover:text-brand-navy transition-colors">
                    Tracking
                  </Link>
                </li>
                <li>
                  <Link href="/pricing" className="hover:text-brand-navy transition-colors">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="/api-docs" className="hover:text-brand-navy transition-colors">
                    API docs
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="hover:text-brand-navy transition-colors">
                    Help center
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar matching Screenshot 3 */}
        <div className="pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © 2026 Flowship Logistics. All rights reserved.
          </div>

          <div className="flex items-center gap-4 text-slate-600">
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="hover:text-brand-navy transition-colors"
            >
              <Linkedin className="w-4 h-4" />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="hover:text-brand-navy transition-colors"
            >
              <Instagram className="w-4 h-4" />
            </a>
            <a
              href="https://x.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter / X"
              className="hover:text-brand-navy transition-colors"
            >
              <Twitter className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
