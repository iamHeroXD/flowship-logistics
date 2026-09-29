'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { CurrencyCode, formatMoney } from '@/lib/formatters';

interface CurrencyContextType {
  currency: CurrencyCode;
  setCurrency: (code: CurrencyCode) => void;
  format: (amountInUSD: number) => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currency, setCurrencyState] = useState<CurrencyCode>('USD');

  useEffect(() => {
    try {
      const stored = localStorage.getItem('flowship_currency') as CurrencyCode;
      if (stored) setCurrencyState(stored);
    } catch {}
  }, []);

  const setCurrency = (code: CurrencyCode) => {
    setCurrencyState(code);
    try {
      localStorage.setItem('flowship_currency', code);
    } catch {}
  };

  const format = (amountInUSD: number) => formatMoney(amountInUSD, currency);

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, format }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error('useCurrency must be used within CurrencyProvider');
  return ctx;
};
