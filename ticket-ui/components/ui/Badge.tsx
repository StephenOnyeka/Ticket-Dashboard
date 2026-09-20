import React from 'react';
import type { TicketStatus, TicketChannel, TicketPriority } from '@/lib/types';
import { Global, Sms, Messages3, Clock, TickCircle, CloseCircle, Flash } from 'iconsax-react';

// ─────────────────────────────────────────────
//  Status Badge
// ─────────────────────────────────────────────

interface StatusBadgeProps {
  status: TicketStatus;
  size?: 'sm' | 'md';
}

export function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const isSm = size === 'sm';
  const padding = isSm ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs';

  if (status === 'open') {
    return (
      <span className={`inline-flex items-center gap-1.5 font-semibold rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 ${padding}`}>
        <Clock size={isSm ? 12 : 14} variant="Linear" color="currentColor" />
        <span>Open</span>
      </span>
    );
  }

  if (status === 'pending') {
    return (
      <span className={`inline-flex items-center gap-1.5 font-semibold rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 ${padding}`}>
        <TickCircle size={isSm ? 12 : 14} variant="Linear" color="currentColor" />
        <span>Pending</span>
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center gap-1.5 font-semibold rounded-lg bg-slate-500/10 text-slate-600 dark:text-slate-400 border border-slate-500/20 ${padding}`}>
      <CloseCircle size={isSm ? 12 : 14} variant="Linear" color="currentColor" />
      <span>Closed</span>
    </span>
  );
}

// ─────────────────────────────────────────────
//  Channel Badge
// ─────────────────────────────────────────────

interface ChannelBadgeProps {
  channel: TicketChannel;
  size?: 'sm' | 'md';
}

export function ChannelBadge({ channel, size = 'md' }: ChannelBadgeProps) {
  const isSm = size === 'sm';
  const padding = isSm ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs';

  if (channel === 'web') {
    return (
      <span className={`inline-flex items-center gap-1.5 font-medium rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 ${padding}`}>
        <Global size={isSm ? 12 : 14} variant="Linear" color="currentColor" />
        <span>Web</span>
      </span>
    );
  }

  if (channel === 'email') {
    return (
      <span className={`inline-flex items-center gap-1.5 font-medium rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 ${padding}`}>
        <Sms size={isSm ? 12 : 14} variant="Linear" color="currentColor" />
        <span>Email</span>
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center gap-1.5 font-medium rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20 ${padding}`}>
      <Messages3 size={isSm ? 12 : 14} variant="Linear" color="currentColor" />
      <span>Messaging</span>
    </span>
  );
}

// ─────────────────────────────────────────────
//  Priority Badge
// ─────────────────────────────────────────────

interface PriorityBadgeProps {
  priority: TicketPriority;
  size?: 'sm' | 'md';
}

export function PriorityBadge({ priority, size = 'md' }: PriorityBadgeProps) {
  const isSm = size === 'sm';
  const padding = isSm ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs';

  if (priority === 'urgent') {
    return (
      <span className={`inline-flex items-center gap-1 font-semibold rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 ${padding}`}>
        <Flash size={isSm ? 12 : 14} variant="Bold" color="currentColor" />
        <span>Urgent</span>
      </span>
    );
  }

  if (priority === 'high') {
    return (
      <span className={`inline-flex items-center gap-1 font-semibold rounded-lg bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20 ${padding}`}>
        <span>High</span>
      </span>
    );
  }

  if (priority === 'medium') {
    return (
      <span className={`inline-flex items-center gap-1 font-medium rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 ${padding}`}>
        <span>Medium</span>
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center gap-1 font-medium rounded-lg bg-slate-500/10 text-slate-500 dark:text-slate-400 border border-slate-500/20 ${padding}`}>
      <span>Low</span>
    </span>
  );
}

// ─────────────────────────────────────────────
//  Generic Badge
// ─────────────────────────────────────────────

interface GenericBadgeProps {
  children: React.ReactNode;
  variant?: string;
  size?: 'sm' | 'md';
  className?: string;
}

export function Badge({ children, variant = 'open', size = 'md', className = '' }: GenericBadgeProps) {
  const isSm = size === 'sm';
  const padding = isSm ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs';

  return (
    <span className={`inline-flex items-center gap-1 font-medium rounded-lg bg-slate-500/10 text-slate-700 dark:text-slate-300 border border-slate-500/20 ${padding} ${className}`}>
      {children}
    </span>
  );
}
