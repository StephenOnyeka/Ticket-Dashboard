import React from 'react';
import type { TicketStatus, TicketChannel, TicketPriority } from '@/lib/types';

// ─────────────────────────────────────────────
//  Status Badge
// ─────────────────────────────────────────────

const statusConfig: Record<TicketStatus, { label: string; className: string }> = {
  open: { label: 'Open', className: 'badge-open' },
  pending: { label: 'Pending', className: 'badge-pending' },
  closed: { label: 'Closed', className: 'badge-closed' },
};

const channelConfig: Record<TicketChannel, { label: string; className: string; icon: string }> = {
  web: { label: 'Web', className: 'badge-web', icon: '🌐' },
  email: { label: 'Email', className: 'badge-email', icon: '✉️' },
  messaging: { label: 'Messaging', className: 'badge-messaging', icon: '💬' },
};

const priorityConfig: Record<TicketPriority, { label: string; className: string }> = {
  urgent: { label: 'Urgent', className: 'badge-urgent' },
  high: { label: 'High', className: 'badge-high' },
  medium: { label: 'Medium', className: 'badge-medium' },
  low: { label: 'Low', className: 'badge-low' },
};

interface StatusBadgeProps {
  status: TicketStatus;
  size?: 'sm' | 'md';
}

export function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const config = statusConfig[status];
  return (
    <span className={`badge ${config?.className || 'badge-open'} ${size === 'sm' ? 'badge-sm' : ''}`}>
      <span className="badge-dot" />
      {config?.label || status}
    </span>
  );
}

interface ChannelBadgeProps {
  channel: TicketChannel;
  size?: 'sm' | 'md';
}

export function ChannelBadge({ channel, size = 'md' }: ChannelBadgeProps) {
  const config = channelConfig[channel];
  return (
    <span className={`badge ${config?.className || 'badge-web'} ${size === 'sm' ? 'badge-sm' : ''}`}>
      <span className="badge-icon">{config?.icon || ''}</span>
      {config?.label || channel}
    </span>
  );
}

interface PriorityBadgeProps {
  priority: TicketPriority;
  size?: 'sm' | 'md';
}

export function PriorityBadge({ priority, size = 'md' }: PriorityBadgeProps) {
  const config = priorityConfig[priority];
  return (
    <span className={`badge ${config?.className || 'badge-medium'} ${size === 'sm' ? 'badge-sm' : ''}`}>
      {config?.label || priority}
    </span>
  );
}

interface GenericBadgeProps {
  children: React.ReactNode;
  variant?: string;
  size?: 'sm' | 'md';
  className?: string;
}

export function Badge({ children, variant = 'open', size = 'md', className = '' }: GenericBadgeProps) {
  return (
    <span className={`badge badge-${variant} ${size === 'sm' ? 'badge-sm' : ''} ${className}`}>
      {children}
    </span>
  );
}
