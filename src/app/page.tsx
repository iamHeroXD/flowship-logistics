'use client';

import React from 'react';
import { Header } from '@/components/landing/Header';
import { Hero } from '@/components/landing/Hero';
import { ServicesSection } from '@/components/landing/ServicesSection';
import { LighterTouchSection } from '@/components/landing/LighterTouchSection';
import { CtaBanner } from '@/components/landing/CtaBanner';
import { Footer } from '@/components/landing/Footer';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-1">
        <Hero />
        <ServicesSection />
        <LighterTouchSection />
        <CtaBanner />
      </main>
      <Footer />
    </div>
  );
}
