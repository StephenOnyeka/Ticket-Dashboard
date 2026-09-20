import React from 'react';

// ─────────────────────────────────────────────
//  Skeleton Loaders
// ─────────────────────────────────────────────

/** Single shimmer skeleton block */
export function Skeleton({ className = '' }: { className?: string }) {
  return (
    <div
      className={`bg-slate-200 dark:bg-slate-800 rounded-lg animate-pulse ${className}`}
      aria-hidden="true"
    />
  );
}

/** Full ticket table row skeleton */
export function TicketRowSkeleton() {
  return (
    <tr className="border-b border-slate-100 dark:border-slate-800/60" aria-hidden="true">
      <td className="px-5 py-4">
        <Skeleton className="h-5 w-16" />
      </td>
      <td className="px-5 py-4 space-y-1.5">
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-3 w-32" />
      </td>
      <td className="px-5 py-4">
        <Skeleton className="h-5 w-16 rounded-full" />
      </td>
      <td className="px-5 py-4">
        <Skeleton className="h-5 w-16 rounded-full" />
      </td>
      <td className="px-5 py-4">
        <Skeleton className="h-4 w-24" />
      </td>
      <td className="px-5 py-4">
        <Skeleton className="h-4 w-16" />
      </td>
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
    <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 shadow-sm space-y-3" aria-hidden="true">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-8 w-16" />
    </div>
  );
}

/** Ticket detail skeleton */
export function DetailSkeleton() {
  return (
    <div className="space-y-6" aria-hidden="true">
      {/* Header card */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-4">
        <div className="flex justify-between items-center">
          <Skeleton className="h-5 w-20" />
          <div className="flex gap-2">
            <Skeleton className="h-5 w-16 rounded-full" />
            <Skeleton className="h-5 w-16 rounded-full" />
          </div>
        </div>
        <Skeleton className="h-7 w-3/4" />
        <div className="flex gap-4 pt-2 border-t border-slate-100 dark:border-slate-800">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-32" />
        </div>
      </div>
      {/* Body */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-3">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-4/6" />
      </div>
    </div>
  );
}
