import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/contexts/AuthContext';
import { CurrencyProvider } from '@/contexts/CurrencyContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { ToastProvider } from '@/contexts/ToastContext';
import { RoleSwitcherBanner } from '@/components/shared/RoleSwitcherBanner';

export const metadata: Metadata = {
  title: 'Flowship Logistics — Move effortlessly with real-time clarity',
  description:
    'Enterprise-grade multi-modal logistics, automated dispatching, millimeter-precision GPS tracking, and real-time supply chain clarity.',
  keywords: [
    'logistics',
    'freight shipping',
    'warehousing',
    'real-time tracking',
    'fleet dispatch',
    'supply chain',
    'express courier',
  ],
  authors: [{ name: 'Flowship Logistics Systems' }],
  openGraph: {
    title: 'Flowship Logistics — Enterprise Supply Chain Intelligence',
    description: 'Move effortlessly with real-time clarity. End-to-end multi-modal freight operations.',
    type: 'website',
    locale: 'en_US',
    siteName: 'Flowship Logistics',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col font-sans">
        <AuthProvider>
          <CurrencyProvider>
            <LanguageProvider>
              <ToastProvider>
                <RoleSwitcherBanner />
                <div className="flex-1 flex flex-col">{children}</div>
              </ToastProvider>
            </LanguageProvider>
          </CurrencyProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
