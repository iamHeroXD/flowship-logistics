'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Truck, ShieldCheck, ArrowRight, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/contexts/ToastContext';
import { useAuth } from '@/contexts/AuthContext';

function VerifyOtpContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || 'your email';
  const { login } = useAuth();
  const { success, error } = useToast();

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(60);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((t) => t - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) value = value.slice(-1);
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    const fullCode = otp.join('');
    if (fullCode.length !== 6) {
      error('Please enter the full 6-digit verification code.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ otp: fullCode, email }),
      });
      const data = await res.json();

      if (data.success) {
        success('Verification successful! Account activated.');
        login('CUSTOMER');
        router.push('/dashboard');
      } else {
        error(data.error?.message || 'Invalid code.');
      }
    } catch {
      error('Verification service unavailable.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = () => {
    setTimer(60);
    success('A new 6-digit OTP code has been dispatched to your email.');
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
          Verify Security Code
        </h2>
        <p className="mt-1 text-xs text-slate-500">
          Enter the 6-digit code sent to <strong className="text-slate-700">{email}</strong>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-elevated rounded-3xl sm:px-10 border border-slate-200/80">
          <form onSubmit={handleVerify} className="space-y-6">
            <div className="flex justify-center gap-2 sm:gap-3">
              {otp.map((digit, idx) => (
                <input
                  key={idx}
                  id={`otp-${idx}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(idx, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(idx, e)}
                  className="w-12 h-14 sm:w-14 sm:h-16 text-center text-2xl font-extrabold text-brand-navy bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:border-brand-teal focus:bg-white focus:ring-2 focus:ring-brand-teal/20 transition-all font-mono"
                  required
                />
              ))}
            </div>

            <div className="text-center text-xs text-slate-500">
              {timer > 0 ? (
                <span>Resend code in {timer}s</span>
              ) : (
                <button
                  type="button"
                  onClick={handleResend}
                  className="text-brand-teal font-semibold hover:underline inline-flex items-center gap-1"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Resend 6-digit Code</span>
                </button>
              )}
            </div>

            <Button
              type="submit"
              variant="pill-primary"
              size="lg"
              className="w-full"
              isLoading={loading}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Verify & Enter Portal
            </Button>
          </form>

          <div className="mt-6 text-center text-xs text-slate-400">
            Hint: In development, any 6 digits (e.g. 123456) are accepted.
          </div>
        </div>
      </div>
    </div>
  );
}

export default function VerifyOtpPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-slate-500">Loading verification...</div>}>
      <VerifyOtpContent />
    </Suspense>
  );
}
