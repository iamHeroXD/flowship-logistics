'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { DashboardHeader } from '@/components/layout/DashboardHeader';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { formatRelativeTime } from '@/lib/formatters';
import { NotificationItem } from '@/types';
import { Bell, Check, CheckCheck, Package, DollarSign, Shield, Info } from 'lucide-react';

export default function NotificationsPage() {
  const { user } = useAuth();
  const { success, error } = useToast();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [filter, setFilter] = useState<'ALL' | 'UNREAD'>('ALL');
  const [loading, setLoading] = useState(true);

  const fetchNotifications = () => {
    if (!user?.id) return;
    fetch(`/api/notifications?userId=${user.id}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.success && Array.isArray(d.data)) {
          setNotifications(d.data);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchNotifications();
  }, [user?.id]);

  const markAsRead = async (id: string) => {
    try {
      const res = await fetch('/api/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notificationId: id, userId: user?.id }),
      });
      if (res.ok) {
        setNotifications((prev) =>
          prev.map((n) => (n.id === id ? { ...n, read: true } : n))
        );
      }
    } catch {}
  };

  const markAllAsRead = async () => {
    try {
      const res = await fetch('/api/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ markAll: true, userId: user?.id }),
      });
      if (res.ok) {
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
        success('All notifications marked as read.');
      }
    } catch {
      error('Failed to mark notifications.');
    }
  };

  const filtered = notifications.filter((n) => (filter === 'UNREAD' ? !n.read : true));

  const getIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'SHIPMENT':
        return <Package className="w-4 h-4 text-brand-teal" />;
      case 'PAYMENT':
        return <DollarSign className="w-4 h-4 text-emerald-600" />;
      case 'SECURITY':
        return <Shield className="w-4 h-4 text-rose-600" />;
      default:
        return <Info className="w-4 h-4 text-blue-600" />;
    }
  };

  return (
    <>
      <DashboardHeader
        title="Notification Center"
        subtitle="Real-time dispatch alerts, milestone updates, and financial statements."
      />

      <div className="p-6 sm:p-8 max-w-4xl mx-auto space-y-6">
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-subtle flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilter('ALL')}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                filter === 'ALL'
                  ? 'bg-brand-navy text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All ({notifications.length})
            </button>
            <button
              onClick={() => setFilter('UNREAD')}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                filter === 'UNREAD'
                  ? 'bg-brand-navy text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Unread ({notifications.filter((n) => !n.read).length})
            </button>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={markAllAsRead}
            disabled={notifications.every((n) => n.read)}
            leftIcon={<CheckCheck className="w-4 h-4" />}
          >
            Mark All as Read
          </Button>
        </div>

        {/* Notifications List */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-subtle divide-y divide-slate-100 overflow-hidden">
          {filtered.map((item) => (
            <div
              key={item.id}
              className={`p-5 sm:px-6 flex items-start justify-between gap-4 transition-colors ${
                item.read ? 'bg-white hover:bg-slate-50/50' : 'bg-emerald-50/30 hover:bg-emerald-50/50'
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center shrink-0 mt-0.5">
                  {getIcon(item.type)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-900">{item.title}</h3>
                    {!item.read && (
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    )}
                  </div>
                  <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{item.message}</p>
                  <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-400 font-medium">
                    <span>{formatRelativeTime(item.createdAt)}</span>
                    {item.linkUrl && (
                      <>
                        <span>&bull;</span>
                        <Link
                          href={item.linkUrl}
                          className="text-brand-teal hover:underline font-semibold"
                        >
                          View Details &rarr;
                        </Link>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {!item.read && (
                <button
                  onClick={() => markAsRead(item.id)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                  title="Mark as read"
                >
                  <Check className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}

          {filtered.length === 0 && !loading && (
            <div className="p-12 text-center text-slate-400 text-xs">
              <Bell className="w-8 h-8 mx-auto mb-2 text-slate-300" />
              <span>You have no {filter === 'UNREAD' ? 'unread' : ''} notifications.</span>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
