'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft2, ArrowRight2, Danger, Archive } from 'iconsax-react';
import type { Ticket, PaginatedTickets } from '@/lib/types';
import { StatusBadge, ChannelBadge } from '@/components/ui/Badge';
import { TableSkeleton } from '@/components/ui/Skeleton';

interface TicketTableProps {
  data: PaginatedTickets | undefined;
  isLoading: boolean;
  isError: boolean;
  page: number;
  onPageChange: (page: number) => void;
}

function formatDate(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = diffMs / (1000 * 60 * 60);

  if (diffHours < 1) {
    const mins = Math.floor(diffMs / (1000 * 60));
    return `${mins}m ago`;
  }
  if (diffHours < 24) {
    return `${Math.floor(diffHours)}h ago`;
  }
  if (diffHours < 24 * 7) {
    return `${Math.floor(diffHours / 24)}d ago`;
  }
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function TicketRow({ ticket }: { ticket: Ticket }) {
  const router = useRouter();

  return (
    <motion.tr
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.2 }}
      onClick={() => router.push(`/dashboard/tickets/${ticket.id}`)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          router.push(`/dashboard/tickets/${ticket.id}`);
        }
      }}
      className="border-b border-slate-100 dark:border-slate-800/60 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors cursor-pointer group"
      aria-label={`View ticket: ${ticket.title}`}
    >
      <td className="px-5 py-4 text-xs font-mono font-medium text-slate-500 dark:text-slate-400">
        <span className="px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
          #{ticket.id.slice(-6)}
        </span>
      </td>
      <td className="px-5 py-4">
        <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-1">
          {ticket.title}
        </div>
        <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
          {ticket.userEmail}
        </div>
      </td>
      <td className="px-5 py-4">
        <StatusBadge status={ticket.status} size="sm" />
      </td>
      <td className="px-5 py-4">
        <ChannelBadge channel={ticket.channel} size="sm" />
      </td>
      <td className="px-5 py-4 text-xs font-medium text-slate-700 dark:text-slate-300">
        {ticket.userName}
      </td>
      <td className="px-5 py-4 text-xs text-slate-500 dark:text-slate-400 font-medium">
        <span title={new Date(ticket.createdAt).toLocaleString()}>
          {formatDate(ticket.createdAt)}
        </span>
      </td>
    </motion.tr>
  );
}

export function TicketTable({ data, isLoading, isError, page, onPageChange }: TicketTableProps) {
  const tickets = data?.data || [];
  const totalPages = data?.totalPages || 1;
  const total = data?.total || 0;

  return (
    <div className="rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-colors duration-200" role="region" aria-label="Tickets list">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse" aria-label="Support tickets">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              <th scope="col" className="px-5 py-3.5">ID</th>
              <th scope="col" className="px-5 py-3.5">Title / Email</th>
              <th scope="col" className="px-5 py-3.5">Status</th>
              <th scope="col" className="px-5 py-3.5">Channel</th>
              <th scope="col" className="px-5 py-3.5">User</th>
              <th scope="col" className="px-5 py-3.5">Created</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <TableSkeleton rows={8} />
            ) : isError ? (
              <tr>
                <td colSpan={6} className="px-5 py-12 text-center text-rose-500">
                  <div className="flex flex-col items-center gap-2">
                    <Danger size={32} variant="Linear" color="currentColor" />
                    <p className="text-xs font-semibold">Failed to load tickets. Please try again.</p>
                  </div>
                </td>
              </tr>
            ) : tickets.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-5 py-12 text-center text-slate-400 dark:text-slate-500">
                  <div className="flex flex-col items-center gap-2">
                    <Archive size={36} variant="Linear" color="currentColor" />
                    <p className="text-xs font-semibold">No tickets found matching your filters.</p>
                  </div>
                </td>
              </tr>
            ) : (
              <AnimatePresence mode="wait">
                {tickets.map((ticket) => (
                  <TicketRow key={ticket.id} ticket={ticket} />
                ))}
              </AnimatePresence>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {!isLoading && total > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-5 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 text-xs text-slate-500 dark:text-slate-400">
          <div>
            Showing <strong className="text-slate-900 dark:text-white font-semibold">{((page - 1) * 10) + 1}–{Math.min(page * 10, total)}</strong> of <strong className="text-slate-900 dark:text-white font-semibold">{total}</strong> tickets
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onPageChange(page - 1)}
              disabled={page <= 1}
              aria-label="Previous page"
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <ArrowLeft2 size={14} variant="Linear" color="currentColor" />
            </button>
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              const pageNum = i + 1;
              const isActive = page === pageNum;
              return (
                <button
                  key={pageNum}
                  onClick={() => onPageChange(pageNum)}
                  aria-label={`Page ${pageNum}`}
                  aria-current={isActive ? 'page' : undefined}
                  className={`w-8 h-8 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
            <button
              onClick={() => onPageChange(page + 1)}
              disabled={page >= totalPages}
              aria-label="Next page"
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <ArrowRight2 size={14} variant="Linear" color="currentColor" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
