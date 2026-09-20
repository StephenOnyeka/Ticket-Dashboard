'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Ticket } from 'iconsax-react';

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
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 text-white gap-4" aria-label="Loading">
      <div className="w-14 h-14 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-xl shadow-indigo-600/30 animate-pulse">
        <Ticket size={32} variant="Bold" color="currentColor" />
      </div>
      <div className="text-sm font-semibold tracking-tight">SupportDesk</div>
      <div className="w-6 h-6 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}
