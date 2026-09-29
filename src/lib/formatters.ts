export type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'NGN' | 'INR';

export const CURRENCY_RATES: Record<CurrencyCode, { symbol: string; rate: number; prefix: boolean }> = {
  USD: { symbol: '$', rate: 1.0, prefix: true },
  EUR: { symbol: '€', rate: 0.92, prefix: true },
  GBP: { symbol: '£', rate: 0.79, prefix: true },
  NGN: { symbol: '₦', rate: 1450.0, prefix: true },
  INR: { symbol: '₹', rate: 86.5, prefix: true },
};

export function formatMoney(amountInUSD: number, currency: CurrencyCode = 'USD'): string {
  const conf = CURRENCY_RATES[currency] || CURRENCY_RATES.USD;
  const converted = Math.round(amountInUSD * conf.rate * 100) / 100;
  const formattedNumber = converted.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return conf.prefix ? `${conf.symbol}${formattedNumber}` : `${formattedNumber} ${conf.symbol}`;
}

export function formatDate(isoString?: string): string {
  if (!isoString) return '—';
  try {
    const d = new Date(isoString);
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return isoString;
  }
}

export function formatDateTime(isoString?: string): string {
  if (!isoString) return '—';
  try {
    const d = new Date(isoString);
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return isoString;
  }
}

export function formatRelativeTime(isoString?: string): string {
  if (!isoString) return 'just now';
  try {
    const diffMs = Date.now() - new Date(isoString).getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return 'just now';
    if (diffMins === 1) return '1 min ago';
    if (diffMins < 60) return `${diffMins} min ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours === 1) return '1 hour ago';
    if (diffHours < 24) return `${diffHours} hours ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} days ago`;
  } catch {
    return 'recently';
  }
}
