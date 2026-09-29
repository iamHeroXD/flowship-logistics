'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Truck, Mail, ArrowRight, ArrowLeft } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/contexts/ToastContext';

export default function ForgotPasswordPage() {
  const { success, error } = useToast();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      error('Please enter your email.');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      success('Password reset instructions have been dispatched.');
    }, 600);
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
          Reset Portal Password
        </h2>
        <p className="mt-1 text-xs text-slate-500">
          Enter your registered email address and we will dispatch recovery instructions.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-elevated rounded-3xl sm:px-10 border border-slate-200/80">
          {submitted ? (
            <div className="text-center space-y-4">
              <div className="p-4 bg-emerald-50 text-emerald-800 rounded-2xl text-xs leading-relaxed border border-emerald-200">
                A password reset authorization link has been sent to <strong>{email}</strong>.
              </div>
              <Link href="/auth/login" className="inline-flex items-center gap-1 text-xs text-brand-teal font-semibold hover:underline">
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to Sign In</span>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Work Email"
                type="email"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                leftIcon={<Mail className="w-4 h-4" />}
                required
              />

              <Button
                type="submit"
                variant="pill-primary"
                size="lg"
                className="w-full mt-2"
                isLoading={loading}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Send Recovery Instructions
              </Button>

              <div className="text-center pt-2">
                <Link href="/auth/login" className="text-xs text-slate-500 hover:text-slate-800 font-medium inline-flex items-center gap-1">
                  <ArrowLeft className="w-3 h-3" />
                  <span>Back to login</span>
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
