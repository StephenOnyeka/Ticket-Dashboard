'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Ticket, Sms, Lock, ArrowRight, Danger } from 'iconsax-react';

const DEMO_ACCOUNTS = [
  { email: 'agent@support.com', password: 'agent123', role: 'Agent', initials: 'AC' },
  { email: 'admin@support.com', password: 'admin123', role: 'Admin Agent', initials: 'SR' },
  { email: 'guest@example.com', password: 'guest123', role: 'Guest', initials: 'GU' },
];

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Please enter your email and password.');
      return;
    }
    setIsLoading(true);
    try {
      await login(email, password);
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed. Check your credentials.');
    } finally {
      setIsLoading(false);
    }
  }

  function fillDemo(account: (typeof DEMO_ACCOUNTS)[0]) {
    setEmail(account.email);
    setPassword(account.password);
    setError('');
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 bg-slate-950 text-white overflow-hidden">
      {/* Ambient background blur orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl animate-orb-slow pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-orb-fast pointer-events-none" />

      <main className="relative z-10 w-full max-w-md p-8 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl shadow-2xl space-y-6" role="main">
        {/* Logo */}
        <div className="flex flex-col items-center text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-500 to-violet-600 flex items-center justify-center text-white shadow-xl shadow-indigo-500/30">
            <Ticket size={32} variant="Bold" color="currentColor" />
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Welcome to SupportDesk</h1>
          <p className="text-xs text-slate-400 font-medium">Sign in to manage your support tickets</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4" noValidate aria-label="Login form">
          <Input
            id="login-email"
            label="Email Address"
            type="email"
            placeholder="you@company.com"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setError(''); }}
            autoComplete="email"
            required
            leftIcon={<Sms size={18} variant="Linear" color="currentColor" />}
          />
          <Input
            id="login-password"
            label="Password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setError(''); }}
            autoComplete="current-password"
            required
            leftIcon={<Lock size={18} variant="Linear" color="currentColor" />}
          />

          {error && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs font-semibold text-rose-400" role="alert" aria-live="polite">
              <Danger size={16} variant="Linear" color="currentColor" />
              <span>{error}</span>
            </div>
          )}

          <Button
            id="login-submit"
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isLoading}
            className="w-full justify-center py-3 text-sm font-bold shadow-lg shadow-indigo-600/30"
          >
            Sign In
          </Button>
        </form>

        {/* Quick Demo Accounts */}
        <div className="pt-2 border-t border-slate-800 space-y-3">
          <div className="text-center">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Quick Fill Demo Accounts</span>
          </div>
          <div className="space-y-2" role="list" aria-label="Demo accounts">
            {DEMO_ACCOUNTS.map((account) => (
              <button
                key={account.email}
                onClick={() => fillDemo(account)}
                type="button"
                role="listitem"
                aria-label={`Use ${account.role} demo account: ${account.email}`}
                className="w-full flex items-center justify-between p-2.5 rounded-2xl bg-slate-800/40 border border-slate-800 hover:bg-slate-800/80 hover:border-slate-700 transition-all text-left group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 flex items-center justify-center text-xs font-bold">
                    {account.initials}
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-white group-hover:text-indigo-400 transition-colors">{account.email}</div>
                    <div className="text-[10px] text-slate-400">{account.role}</div>
                  </div>
                </div>
                <ArrowRight size={16} variant="Linear" color="currentColor" className="text-slate-500 group-hover:text-white transition-colors" />
              </button>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
