'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Sidebar } from '@/components/layout/Sidebar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  // Guard: redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !user) {
      router.replace('/login');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="splash-screen" aria-label="Loading">
        <div className="splash-logo" aria-hidden="true">🎫</div>
        <div className="splash-spinner" aria-hidden="true" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="dashboard-shell">
      <Sidebar />
      <div className="dashboard-main">
        {children}
      </div>
    </div>
  );
}
