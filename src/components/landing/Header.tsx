'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Truck, User as UserIcon, Menu, X, Globe, DollarSign, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import { CurrencyCode } from '@/lib/formatters';
import { LanguageCode } from '@/lib/i18n/translations';

export const Header: React.FC = () => {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { currency, setCurrency } = useCurrency();
  const { language, setLanguage, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const navLinks = [
    { label: t.nav.home, href: '/' },
    { label: t.nav.services, href: '/services' },
    { label: t.nav.tracking, href: '/tracking' },
    { label: t.nav.pricing, href: '/pricing' },
    { label: t.nav.about, href: '/about' },
    { label: t.nav.contact, href: '/contact' },
    { label: t.nav.faq, href: '/faq' },
  ];

  const getPortalLink = () => {
    if (!user) return '/auth/login';
    switch (user.role) {
      case 'DRIVER':
        return '/driver';
      case 'DISPATCHER':
        return '/dispatcher';
      case 'ADMIN':
      case 'SUPER_ADMIN':
        return '/admin';
      case 'CUSTOMER':
      default:
        return '/dashboard';
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-brand-surface flex items-center justify-center text-brand-mint border border-slate-200/60 group-hover:bg-brand-surface-alt transition-colors">
            <Truck className="w-6 h-6 text-brand-mint" />
          </div>
          <span className="text-xl font-bold text-brand-navy tracking-tight">
            Flowship Logistics
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-7">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'text-sm font-medium transition-colors',
                  isActive
                    ? 'text-brand-navy font-semibold'
                    : 'text-slate-600 hover:text-brand-navy'
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Action Controls */}
        <div className="hidden md:flex items-center gap-3">
          {/* Currency Switcher */}
          <div className="relative inline-flex items-center text-xs text-slate-500 bg-slate-50 rounded-lg px-2 py-1 border border-slate-200">
            <DollarSign className="w-3.5 h-3.5 text-slate-400 mr-0.5" />
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
              className="bg-transparent text-slate-700 font-semibold focus:outline-none cursor-pointer"
              aria-label="Select Currency"
            >
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
              <option value="NGN">NGN (₦)</option>
              <option value="INR">INR (₹)</option>
            </select>
          </div>

          {/* Language Switcher */}
          <div className="relative inline-flex items-center text-xs text-slate-500 bg-slate-50 rounded-lg px-2 py-1 border border-slate-200">
            <Globe className="w-3.5 h-3.5 text-slate-400 mr-1" />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as LanguageCode)}
              className="bg-transparent text-slate-700 font-semibold uppercase focus:outline-none cursor-pointer"
              aria-label="Select Language"
            >
              <option value="en">EN</option>
              <option value="es">ES</option>
              <option value="fr">FR</option>
              <option value="de">DE</option>
            </select>
          </div>

          {/* Profile / Account Control matching Screenshot 1 */}
          <div className="relative">
            <button
              onClick={() => setProfileDropdownOpen((prev) => !prev)}
              className="w-11 h-11 rounded-full bg-brand-navy text-white flex items-center justify-center hover:bg-slate-800 transition-colors shadow-xs focus:ring-2 focus:ring-brand-teal/40"
              aria-label="User Account Menu"
            >
              <UserIcon className="w-5 h-5 text-white" />
            </button>

            {profileDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-elevated border border-slate-100 py-2 z-50 text-sm animate-in fade-in zoom-in-95 duration-150">
                {user ? (
                  <>
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="font-semibold text-brand-navy truncate">{user.name}</p>
                      <p className="text-xs text-slate-500 truncate">{user.email}</p>
                      <span className="inline-block mt-1 text-[10px] uppercase font-bold tracking-wider text-brand-mint bg-emerald-50 px-2 py-0.5 rounded-full">
                        {user.role.replace(/_/g, ' ')}
                      </span>
                    </div>
                    <Link
                      href={getPortalLink()}
                      onClick={() => setProfileDropdownOpen(false)}
                      className="block px-4 py-2 text-slate-700 hover:bg-slate-50 font-medium"
                    >
                      Open {user.role.replace(/_/g, ' ')} Portal
                    </Link>
                    <Link
                      href="/dashboard/shipments/new"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="block px-4 py-2 text-slate-700 hover:bg-slate-50"
                    >
                      Create Shipment
                    </Link>
                    <Link
                      href="/dashboard/tracking"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="block px-4 py-2 text-slate-700 hover:bg-slate-50"
                    >
                      My Tracking
                    </Link>
                    <div className="border-t border-slate-100 mt-1">
                      <button
                        onClick={() => {
                          logout();
                          setProfileDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign out</span>
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <Link
                      href="/auth/login"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="block px-4 py-2 text-slate-700 hover:bg-slate-50 font-medium"
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/auth/register"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="block px-4 py-2 text-slate-700 hover:bg-slate-50"
                    >
                      Create Account
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center gap-2">
          <Link
            href={getPortalLink()}
            className="w-9 h-9 rounded-full bg-brand-navy text-white flex items-center justify-center text-xs"
            aria-label="User Account"
          >
            <UserIcon className="w-4 h-4" />
          </Link>
          <button
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white px-4 pt-3 pb-6 flex flex-col gap-3 shadow-lg">
          <nav className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  'px-3 py-2 rounded-lg text-sm font-medium',
                  pathname === link.href
                    ? 'bg-brand-surface text-brand-navy font-semibold'
                    : 'text-slate-600 hover:bg-slate-50'
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="border-t border-slate-100 pt-3 flex items-center justify-between text-xs text-slate-500">
            <span>Currency: {currency}</span>
            <span>Language: {language.toUpperCase()}</span>
          </div>
        </div>
      )}
    </header>
  );
};
