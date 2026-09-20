import React from 'react';
import type { TicketStatus, TicketChannel } from '@/lib/types';

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

interface StatusBadgeProps {
  status: TicketStatus;
  size?: 'sm' | 'md';
}

export function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const config = statusConfig[status];
  return (
    <span className={`badge ${config.className} ${size === 'sm' ? 'badge-sm' : ''}`}>
      <span className="badge-dot" />
      {config.label}
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
    <span className={`badge ${config.className} ${size === 'sm' ? 'badge-sm' : ''}`}>
      <span className="badge-icon">{config.icon}</span>
      {config.label}
    </span>
  );
}
