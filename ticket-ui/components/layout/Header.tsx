'use client';

import React from 'react';
import { useAuth } from '@/lib/auth-context';

interface HeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  showSSEIndicator?: boolean;
}

export function Header({ title, subtitle, actions, showSSEIndicator }: HeaderProps) {
  const { user } = useAuth();

  return (
    <header className="dashboard-header" role="banner">
      <div className="header-left">
        <div className="header-titles">
          <h1 className="header-title">{title}</h1>
          {subtitle && <p className="header-subtitle">{subtitle}</p>}
        </div>
      </div>

      <div className="header-right">
        {showSSEIndicator && (
          <div className="sse-indicator" title="Real-time updates active" aria-label="Real-time updates active">
            <span className="sse-dot" aria-hidden="true" />
            <span className="sse-label">Live</span>
          </div>
        )}
        {actions}
        <div className="header-avatar" aria-label={`Logged in as ${user?.name}`} title={user?.email}>
          {user?.avatarInitials || '?'}
        </div>
      </div>
    </header>
  );
}
