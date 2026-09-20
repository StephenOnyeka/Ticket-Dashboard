'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

const DEMO_ACCOUNTS = [
  { email: 'agent@support.com', password: 'agent123', role: 'Agent', initials: 'AC' },
  { email: 'admin@support.com', password: 'admin123', role: 'Agent', initials: 'SR' },
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
    <div className="login-page">
      {/* Background decoration */}
      <div className="login-bg-orb login-bg-orb-1" aria-hidden="true" />
      <div className="login-bg-orb login-bg-orb-2" aria-hidden="true" />

      <main className="login-card" role="main">
        {/* Logo */}
        <div className="login-logo" aria-hidden="true">🎫</div>
        <h1 className="login-title">Welcome to SupportDesk</h1>
        <p className="login-subtitle">Sign in to manage your support tickets</p>

        {/* Login form */}
        <form onSubmit={handleSubmit} className="login-form" noValidate aria-label="Login form">
          <Input
            id="login-email"
            label="Email Address"
            type="email"
            placeholder="you@company.com"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setError(''); }}
            autoComplete="email"
            required
            leftIcon={<span aria-hidden="true">✉</span>}
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
            leftIcon={<span aria-hidden="true">🔒</span>}
          />

          {error && (
            <div className="login-error" role="alert" aria-live="polite">
              <span aria-hidden="true">⚠</span> {error}
            </div>
          )}

          <Button
            id="login-submit"
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isLoading}
            className="login-submit"
          >
            Sign In
          </Button>
        </form>

        {/* Demo accounts */}
        <div className="demo-section">
          <div className="demo-divider">
            <span>Demo Accounts</span>
          </div>
          <div className="demo-accounts" role="list" aria-label="Demo accounts">
            {DEMO_ACCOUNTS.map((account) => (
              <button
                key={account.email}
                className="demo-account-btn"
                onClick={() => fillDemo(account)}
                type="button"
                role="listitem"
                aria-label={`Use ${account.role} demo account: ${account.email}`}
              >
                <div className="demo-avatar">{account.initials}</div>
                <div className="demo-info">
                  <div className="demo-email">{account.email}</div>
                  <div className="demo-role">{account.role}</div>
                </div>
                <span className="demo-use" aria-hidden="true">→</span>
              </button>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
