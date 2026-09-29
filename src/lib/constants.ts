import { DeliveryTier, ShipmentStatus, UserRole } from '@/types';

export const APP_CONFIG = {
  name: 'Flowship Logistics',
  tagline: 'Move effortlessly with real-time clarity',
  phone: '+1 (800) 555-FLOW',
  email: 'operations@flowship.com',
  address: '450 Lexington Avenue, New York, NY 10017',
  operationalStats: {
    onTimeRate: '99.4%',
    activeShipments: '48,200+',
    liveSupport: '24/7',
    countriesServed: '54+',
    shipmentsYearly: '2.8M',
    clientRating: '4.9 ★',
  },
};

export const STATUS_CONFIG: Record<
  ShipmentStatus,
  { label: string; bg: string; text: string; border: string; stepIndex: number }
> = {
  PENDING: {
    label: 'Order Created',
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    border: 'border-amber-200',
    stepIndex: 0,
  },
  ASSIGNED: {
    label: 'Driver Assigned',
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-200',
    stepIndex: 1,
  },
  PICKED_UP: {
    label: 'Picked Up',
    bg: 'bg-indigo-50',
    text: 'text-indigo-700',
    border: 'border-indigo-200',
    stepIndex: 2,
  },
  IN_TRANSIT: {
    label: 'In Transit',
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-200',
    stepIndex: 3,
  },
  OUT_FOR_DELIVERY: {
    label: 'Out for Delivery',
    bg: 'bg-teal-50',
    text: 'text-teal-700',
    border: 'border-teal-200',
    stepIndex: 4,
  },
  DELIVERED: {
    label: 'Delivered',
    bg: 'bg-green-50',
    text: 'text-green-800',
    border: 'border-green-200',
    stepIndex: 5,
  },
  CANCELLED: {
    label: 'Cancelled',
    bg: 'bg-rose-50',
    text: 'text-rose-700',
    border: 'border-rose-200',
    stepIndex: -1,
  },
};

export const TIER_CONFIG: Record<
  DeliveryTier,
  { label: string; speed: string; multiplier: number; desc: string }
> = {
  SAME_DAY: {
    label: 'Same-Day Urgent',
    speed: 'Under 6 Hours',
    multiplier: 1.9,
    desc: 'Direct point-to-point courier with dedicated vehicle dispatch.',
  },
  EXPRESS: {
    label: 'Express Priority',
    speed: 'Next Day Morning',
    multiplier: 1.4,
    desc: 'Guaranteed next-morning delivery across urban corridors.',
  },
  STANDARD: {
    label: 'Standard Ground',
    speed: '2-4 Business Days',
    multiplier: 1.0,
    desc: 'Economical, consolidated multi-modal linehaul freight.',
  },
  SCHEDULED: {
    label: 'Scheduled Delivery',
    speed: 'Customer Window',
    multiplier: 1.2,
    desc: 'Precision arrival within an agreed 2-hour appointment window.',
  },
};

export const ROLE_LABELS: Record<UserRole, { label: string; badgeClass: string; path: string }> = {
  CUSTOMER: { label: 'Customer', badgeClass: 'bg-slate-100 text-slate-800', path: '/dashboard' },
  DISPATCHER: { label: 'Dispatcher', badgeClass: 'bg-blue-100 text-blue-800', path: '/dispatcher' },
  DRIVER: { label: 'Driver', badgeClass: 'bg-amber-100 text-amber-800', path: '/driver' },
  ADMIN: { label: 'Admin', badgeClass: 'bg-purple-100 text-purple-800', path: '/admin' },
  SUPER_ADMIN: { label: 'Super Admin', badgeClass: 'bg-rose-100 text-rose-800', path: '/admin' },
};
