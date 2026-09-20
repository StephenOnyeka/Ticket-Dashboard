'use client';

import React from 'react';
import type { PaginatedTickets } from '@/lib/types';

interface StatsCardsProps {
  data: PaginatedTickets | undefined;
  isLoading: boolean;
}

interface StatCardProps {
  label: string;
  value: number | string;
  icon: string;
  color: string;
  isLoading: boolean;
}

function StatCard({ label, value, icon, color, isLoading }: StatCardProps) {
  return (
    <div className={`stat-card stat-card-${color}`} role="region" aria-label={label}>
      <div className="stat-card-header">
        <span className="stat-card-icon" aria-hidden="true">{icon}</span>
        <span className="stat-card-label">{label}</span>
      </div>
      <div className="stat-card-value">
        {isLoading ? (
          <div className="skeleton skeleton-stat-value" aria-hidden="true" />
        ) : (
          <span>{value}</span>
        )}
      </div>
    </div>
  );
}

export function TicketStatsCards({ data, isLoading }: StatsCardsProps) {
  const stats = React.useMemo(() => {
    if (!data) return { total: 0, open: 0, pending: 0, closed: 0 };
    // We only have the current page, so show total from meta
    return {
      total: data.total,
      open: 0,
      pending: 0,
      closed: 0,
    };
  }, [data]);

  return (
    <div className="stats-grid" role="region" aria-label="Ticket statistics">
      <StatCard label="Total Tickets" value={stats.total} icon="🎫" color="indigo" isLoading={isLoading} />
      <StatCard label="Open" value="—" icon="🟢" color="emerald" isLoading={isLoading} />
      <StatCard label="Pending" value="—" icon="🟡" color="amber" isLoading={isLoading} />
      <StatCard label="Closed" value="—" icon="⚫" color="slate" isLoading={isLoading} />
    </div>
  );
}

// Enhanced version that fetches its own per-status counts
export function TicketStatsCardsDetailed({
  totalOpen,
  totalPending,
  totalClosed,
  totalAll,
  isLoading,
}: {
  totalOpen: number;
  totalPending: number;
  totalClosed: number;
  totalAll: number;
  isLoading: boolean;
}) {
  return (
    <div className="stats-grid" role="region" aria-label="Ticket statistics">
      <StatCard label="Total Tickets" value={totalAll} icon="🎫" color="indigo" isLoading={isLoading} />
      <StatCard label="Open" value={totalOpen} icon="🟢" color="emerald" isLoading={isLoading} />
      <StatCard label="Pending" value={totalPending} icon="🟡" color="amber" isLoading={isLoading} />
      <StatCard label="Closed" value={totalClosed} icon="⚫" color="slate" isLoading={isLoading} />
    </div>
  );
}
