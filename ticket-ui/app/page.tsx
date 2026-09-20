'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';

export default function HomePage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (user) {
        router.replace('/dashboard');
      } else {
        router.replace('/login');
      }
    }
  }, [user, isLoading, router]);

  // Show a loading screen while auth rehydrates
  return (
    <div className="splash-screen" aria-label="Loading">
      <div className="splash-logo" aria-hidden="true">🎫</div>
      <div className="splash-title">SupportDesk</div>
      <div className="splash-spinner" aria-hidden="true" />
    </div>
  );
}
