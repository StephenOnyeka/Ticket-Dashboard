'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import {
  Ticket,
  Category,
  TickCircle,
  Clock,
  CloseCircle,
  Global,
  Sms,
  Messages3,
  LogoutCurve,
  ShieldSecurity,
  User,
} from 'iconsax-react';

export function Sidebar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await logout();
    window.location.href = '/login';
  };

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0 border-r border-slate-800 transition-colors duration-200" role="navigation" aria-label="Main navigation">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-800/80">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25">
          <Ticket size={22} variant="Bold" color="currentColor" />
        </div>
        <div>
          <div className="text-base font-bold text-white tracking-tight leading-tight">SupportDesk</div>
          <div className="text-xs text-slate-400 font-medium">Ticket Dashboard</div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-6 overflow-y-auto">
        <div>
          <div className="px-3 mb-2 text-[10px] font-semibold text-slate-400 tracking-wider uppercase">Main</div>
          <div className="space-y-1">
            <Link
              href="/dashboard"
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all duration-150 ${
                pathname === '/dashboard'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'hover:bg-slate-800/60 hover:text-white text-slate-300'
              }`}
            >
              <Category size={18} variant="Linear" color="currentColor" />
              <span>Overview</span>
            </Link>
            <Link
              href="/dashboard?status=open"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium hover:bg-slate-800/60 hover:text-white text-slate-300 transition-all"
            >
              <Clock size={18} variant="Linear" color="currentColor" className="text-emerald-400" />
              <span>Open Tickets</span>
            </Link>
            <Link
              href="/dashboard?status=pending"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium hover:bg-slate-800/60 hover:text-white text-slate-300 transition-all"
            >
              <TickCircle size={18} variant="Linear" color="currentColor" className="text-amber-400" />
              <span>Pending</span>
            </Link>
            <Link
              href="/dashboard?status=closed"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium hover:bg-slate-800/60 hover:text-white text-slate-300 transition-all"
            >
              <CloseCircle size={18} variant="Linear" color="currentColor" className="text-slate-400" />
              <span>Closed</span>
            </Link>
          </div>
        </div>

        <div>
          <div className="px-3 mb-2 text-[10px] font-semibold text-slate-400 tracking-wider uppercase">Channels</div>
          <div className="space-y-1">
            <Link
              href="/dashboard?channel=web"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium hover:bg-slate-800/60 hover:text-white text-slate-300 transition-all"
            >
              <Global size={18} variant="Linear" color="currentColor" className="text-blue-400" />
              <span>Web</span>
            </Link>
            <Link
              href="/dashboard?channel=email"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium hover:bg-slate-800/60 hover:text-white text-slate-300 transition-all"
            >
              <Sms size={18} variant="Linear" color="currentColor" className="text-purple-400" />
              <span>Email</span>
            </Link>
            <Link
              href="/dashboard?channel=messaging"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium hover:bg-slate-800/60 hover:text-white text-slate-300 transition-all"
            >
              <Messages3 size={18} variant="Linear" color="currentColor" className="text-teal-400" />
              <span>Messaging</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* User Footer */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-950/40">
        <div className="flex items-center gap-3 p-2 rounded-xl bg-slate-800/40 border border-slate-800">
          <div className="w-8 h-8 rounded-lg bg-indigo-600/30 border border-indigo-500/30 text-indigo-400 flex items-center justify-center text-xs font-bold">
            {user?.avatarInitials || '??'}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-semibold text-white truncate">{user?.name || 'User'}</div>
            <div className="flex items-center gap-1 text-[11px] text-slate-400">
              {user?.role === 'agent' ? (
                <>
                  <ShieldSecurity size={12} variant="Linear" color="currentColor" className="text-indigo-400" />
                  <span>Agent</span>
                </>
              ) : (
                <>
                  <User size={12} variant="Linear" color="currentColor" className="text-slate-400" />
                  <span>Guest</span>
                </>
              )}
            </div>
          </div>
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
            title="Logout"
          >
            <LogoutCurve size={18} variant="Linear" color="currentColor" />
          </button>
        </div>
      </div>
    </aside>
  );
}
