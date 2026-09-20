'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';

// ─────────────────────────────────────────────
//  Sidebar Navigation
// ─────────────────────────────────────────────

const navLinks = [
  { href: '/dashboard', label: 'Overview', icon: '◈' },
  { href: '/dashboard?status=open', label: 'Open Tickets', icon: '●', status: 'open' },
  { href: '/dashboard?status=pending', label: 'Pending', icon: '◐', status: 'pending' },
  { href: '/dashboard?status=closed', label: 'Closed', icon: '○', status: 'closed' },
];

const channelLinks = [
  { href: '/dashboard?channel=web', label: 'Web', icon: '🌐' },
  { href: '/dashboard?channel=email', label: 'Email', icon: '✉️' },
  { href: '/dashboard?channel=messaging', label: 'Messaging', icon: '💬' },
];

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
    <aside className="sidebar" role="navigation" aria-label="Main navigation">
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon" aria-hidden="true">🎫</div>
        <div>
          <div className="sidebar-logo-title">SupportDesk</div>
          <div className="sidebar-logo-subtitle">Ticket Dashboard</div>
        </div>
      </div>

      {/* Main nav */}
      <nav className="sidebar-nav">
        <div className="sidebar-section-label">MAIN</div>
        {navLinks.map((link) => {
          const isActive = pathname === link.href || (link.href === '/dashboard' && pathname === '/dashboard' && !link.status);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`sidebar-link ${isActive ? 'sidebar-link-active' : ''}`}
              aria-current={isActive ? 'page' : undefined}
            >
              <span className="sidebar-link-icon" aria-hidden="true">{link.icon}</span>
              {link.label}
            </Link>
          );
        })}

        <div className="sidebar-divider" />

        <div className="sidebar-section-label">CHANNELS</div>
        {channelLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="sidebar-link"
          >
            <span className="sidebar-link-icon" aria-hidden="true">{link.icon}</span>
            {link.label}
          </Link>
        ))}
      </nav>

      {/* User info */}
      <div className="sidebar-user">
        <div className="sidebar-avatar" aria-hidden="true">
          {user?.avatarInitials || '??'}
        </div>
        <div className="sidebar-user-info">
          <div className="sidebar-user-name">{user?.name || 'Unknown'}</div>
          <div className="sidebar-user-role">
            {user?.role === 'agent' ? '🛡 Agent' : '👤 Guest'}
          </div>
        </div>
        <button
          className="sidebar-logout"
          onClick={handleLogout}
          disabled={isLoggingOut}
          aria-label="Logout"
          title="Logout"
        >
          {isLoggingOut ? '...' : '⇥'}
        </button>
      </div>
    </aside>
  );
}
