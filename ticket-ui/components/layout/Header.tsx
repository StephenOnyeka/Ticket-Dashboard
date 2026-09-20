'use client';

import React from 'react';
import { useAuth } from '@/lib/auth-context';
import { useTheme } from '@/lib/theme-context';
import { Sun1, Moon, Radio } from 'iconsax-react';

interface HeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  showSSEIndicator?: boolean;
}

export function Header({ title, subtitle, actions, showSSEIndicator }: HeaderProps) {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md transition-colors duration-200" role="banner">
      <div className="flex items-center gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">{title}</h1>
          {subtitle && <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{subtitle}</p>}
        </div>
      </div>

      <div className="flex items-center gap-3">
        {showSSEIndicator && (
          <div className="flex items-center gap-1.5 px-3 py-1 text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-full" title="Real-time updates active">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <Radio size={14} variant="Linear" color="currentColor" className="animate-pulse" />
            <span>Live Stream</span>
          </div>
        )}

        {/* Dark/Light Theme Toggle */}
        <button
          onClick={toggleTheme}
          aria-label="Toggle dark/light theme"
          className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200"
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {theme === 'dark' ? (
            <Sun1 size={18} variant="Linear" color="currentColor" className="text-amber-400" />
          ) : (
            <Moon size={18} variant="Linear" color="currentColor" className="text-indigo-600" />
          )}
        </button>

        {actions}

        {/* User avatar */}
        <div 
          className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white flex items-center justify-center font-semibold text-xs shadow-sm cursor-pointer hover:opacity-90 transition-opacity"
          title={`${user?.name} (${user?.role})`}
        >
          {user?.avatarInitials || '?'}
        </div>
      </div>
    </header>
  );
}
