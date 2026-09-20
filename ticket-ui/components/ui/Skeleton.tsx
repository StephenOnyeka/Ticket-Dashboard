import React from 'react';

// ─────────────────────────────────────────────
//  Skeleton Loaders
// ─────────────────────────────────────────────

/** Single shimmer skeleton block */
export function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`skeleton ${className}`} aria-hidden="true" />;
}

/** Full ticket table row skeleton */
export function TicketRowSkeleton() {
  return (
    <tr className="skeleton-row" aria-hidden="true">
      <td><Skeleton className="skeleton-id" /></td>
      <td><Skeleton className="skeleton-title" /></td>
      <td><Skeleton className="skeleton-badge" /></td>
      <td><Skeleton className="skeleton-badge" /></td>
      <td><Skeleton className="skeleton-email" /></td>
      <td><Skeleton className="skeleton-date" /></td>
    </tr>
  );
}

/** Ticket table skeleton (multiple rows) */
export function TableSkeleton({ rows = 8 }: { rows?: number }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, i) => (
        <TicketRowSkeleton key={i} />
      ))}
    </>
  );
}

/** Stats card skeleton */
export function StatCardSkeleton() {
  return (
    <div className="stat-card skeleton-card" aria-hidden="true">
      <Skeleton className="skeleton-stat-label" />
      <Skeleton className="skeleton-stat-value" />
    </div>
  );
}

/** Ticket detail skeleton */
export function DetailSkeleton() {
  return (
    <div className="detail-skeleton" aria-hidden="true">
      <Skeleton className="skeleton-detail-title" />
      <Skeleton className="skeleton-detail-meta" />
      <Skeleton className="skeleton-detail-body" />
      <Skeleton className="skeleton-detail-body" />
    </div>
  );
}
