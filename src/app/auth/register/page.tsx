'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Truck, User, Mail, Phone, Lock, Building2, ArrowRight } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/contexts/ToastContext';

export default function RegisterPage() {
  const router = useRouter();
  const { success, error } = useToast();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password || !phone) {
      error('Please complete all required fields.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          phone,
          companyName,
          password,
          role: 'CUSTOMER',
        }),
      });

      const data = await res.json();
      if (data.success) {
        success('Account created! Please verify your 6-digit OTP code.');
        router.push(`/auth/verify-otp?email=${encodeURIComponent(email)}`);
      } else {
        error(data.error?.message || 'Registration failed.');
      }
    } catch {
      error('Unable to connect to registration service.');
    } finally {
      setLoading(false);
    }
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
          Create Shipper Account
        </h2>
        <p className="mt-1 text-xs text-slate-500">
          Instant access to automated freight booking, volume quoting, and real-time tracking.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-elevated rounded-3xl sm:px-10 border border-slate-200/80">
          <form className="space-y-4" onSubmit={handleRegister}>
            <Input
              label="Full Name"
              placeholder="e.g. Elena Rostova"
              value={name}
              onChange={(e) => setName(e.target.value)}
              leftIcon={<User className="w-4 h-4" />}
              required
            />

            <Input
              label="Work Email"
              type="email"
              placeholder="name@organization.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              leftIcon={<Mail className="w-4 h-4" />}
              required
            />

            <Input
              label="Phone Number"
              placeholder="+1 (555) 000-0000"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              leftIcon={<Phone className="w-4 h-4" />}
              required
            />

            <Input
              label="Company / Organization (Optional)"
              placeholder="e.g. Apex Robotics"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              leftIcon={<Building2 className="w-4 h-4" />}
            />

            <Input
              label="Password"
              type="password"
              placeholder="At least 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              leftIcon={<Lock className="w-4 h-4" />}
              required
            />

            <div className="text-[11px] text-slate-500 leading-normal">
              By registering, you agree to the Flowship Logistics Terms of Freight Service and Privacy Policy.
            </div>

            <Button
              type="submit"
              variant="pill-primary"
              size="lg"
              className="w-full mt-2"
              isLoading={loading}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Continue to Verification
            </Button>
          </form>

          <div className="mt-6 text-center text-xs text-slate-500">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-brand-teal font-semibold hover:underline">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
