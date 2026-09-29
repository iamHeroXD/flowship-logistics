'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Truck, Lock, Mail, ArrowRight, ShieldCheck } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { UserRole } from '@/types';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const { success, error } = useToast();

  const [email, setEmail] = useState('customer@flowship.com');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (data.success && data.data?.user) {
        login(data.data.user.role);
        success(`Welcome back, ${data.data.user.name}!`);

        const role = data.data.user.role;
        if (role === 'DRIVER') router.push('/driver');
        else if (role === 'DISPATCHER') router.push('/dispatcher');
        else if (role === 'ADMIN' || role === 'SUPER_ADMIN') router.push('/admin');
        else router.push('/dashboard');
      } else {
        error(data.error?.message || 'Login failed. Please check credentials.');
      }
    } catch {
      error('Unable to connect to authentication service.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickRole = (role: UserRole, demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('password123');
    login(role);
    success(`Switched role to ${role.replace(/_/g, ' ')}`);
    if (role === 'DRIVER') router.push('/driver');
    else if (role === 'DISPATCHER') router.push('/dispatcher');
    else if (role === 'ADMIN' || role === 'SUPER_ADMIN') router.push('/admin');
    else router.push('/dashboard');
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-slate-50">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-flex items-center gap-2.5 mb-4 group">
          <div className="w-10 h-10 rounded-xl bg-brand-surface flex items-center justify-center text-brand-mint border border-slate-200">
            <Truck className="w-6 h-6 text-brand-mint" />
          </div>
          <span className="text-2xl font-bold text-brand-navy tracking-tight">
            Flowship Logistics
          </span>
        </Link>
        <h2 className="text-2xl font-extrabold text-brand-navy tracking-tight">
          Sign In to Logistics Portal
        </h2>
        <p className="mt-1 text-xs text-slate-500">
          Enter your authorized credentials or select a demonstration persona.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-elevated rounded-3xl sm:px-10 border border-slate-200/80">
          <form className="space-y-4" onSubmit={handleLogin}>
            <Input
              label="Work Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@company.com"
              leftIcon={<Mail className="w-4 h-4" />}
              required
            />

            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              leftIcon={<Lock className="w-4 h-4" />}
              required
            />

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 text-slate-600 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded text-brand-teal focus:ring-brand-teal" />
                <span>Remember this workstation</span>
              </label>
              <Link href="/auth/forgot-password" className="text-brand-teal hover:underline font-semibold">
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              variant="pill-primary"
              size="lg"
              className="w-full mt-2"
              isLoading={loading}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Sign In to Operations
            </Button>
          </form>

          {/* Quick Demo Persona Switcher */}
          <div className="mt-8 pt-6 border-t border-slate-100">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider text-center mb-3">
              One-Click Persona Login
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => handleQuickRole('CUSTOMER', 'customer@flowship.com')}
                className="p-2.5 rounded-xl border border-slate-200 hover:border-brand-teal bg-slate-50/70 hover:bg-brand-surface font-semibold text-slate-800 text-left transition-all"
              >
                <div>Customer</div>
                <div className="text-[10px] text-slate-400 font-normal">Elena (Shipper)</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickRole('DISPATCHER', 'dispatcher@flowship.com')}
                className="p-2.5 rounded-xl border border-slate-200 hover:border-brand-teal bg-slate-50/70 hover:bg-brand-surface font-semibold text-slate-800 text-left transition-all"
              >
                <div>Dispatcher</div>
                <div className="text-[10px] text-slate-400 font-normal">Marcus (Ops)</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickRole('DRIVER', 'driver@flowship.com')}
                className="p-2.5 rounded-xl border border-slate-200 hover:border-brand-teal bg-slate-50/70 hover:bg-brand-surface font-semibold text-slate-800 text-left transition-all"
              >
                <div>Driver</div>
                <div className="text-[10px] text-slate-400 font-normal">Carlos (Mobile)</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickRole('ADMIN', 'admin@flowship.com')}
                className="p-2.5 rounded-xl border border-slate-200 hover:border-brand-teal bg-slate-50/70 hover:bg-brand-surface font-semibold text-slate-800 text-left transition-all"
              >
                <div>Admin</div>
                <div className="text-[10px] text-slate-400 font-normal">Sarah (Fleet/Ops)</div>
              </button>
            </div>
          </div>

          <div className="mt-6 text-center text-xs text-slate-500">
            Need an enterprise account?{' '}
            <Link href="/auth/register" className="text-brand-teal font-semibold hover:underline">
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
