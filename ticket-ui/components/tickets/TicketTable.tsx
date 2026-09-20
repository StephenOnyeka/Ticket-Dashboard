'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import type { Ticket, PaginatedTickets } from '@/lib/types';
import { StatusBadge, ChannelBadge } from '@/components/ui/Badge';
import { TableSkeleton } from '@/components/ui/Skeleton';

// ─────────────────────────────────────────────
//  Ticket Table
// ─────────────────────────────────────────────

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
    <tr
      className="ticket-row"
      onClick={() => router.push(`/dashboard/tickets/${ticket.id}`)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          router.push(`/dashboard/tickets/${ticket.id}`);
        }
      }}
      aria-label={`View ticket: ${ticket.title}`}
    >
      <td className="ticket-cell ticket-id">
        <span className="ticket-id-text">#{ticket.id.slice(-6)}</span>
      </td>
      <td className="ticket-cell ticket-title-cell">
        <div className="ticket-title">{ticket.title}</div>
        <div className="ticket-email">{ticket.userEmail}</div>
      </td>
      <td className="ticket-cell">
        <StatusBadge status={ticket.status} size="sm" />
      </td>
      <td className="ticket-cell">
        <ChannelBadge channel={ticket.channel} size="sm" />
      </td>
      <td className="ticket-cell ticket-user-cell">
        <span className="ticket-user-name">{ticket.userName}</span>
      </td>
      <td className="ticket-cell ticket-date-cell">
        <span className="ticket-date" title={new Date(ticket.createdAt).toLocaleString()}>
          {formatDate(ticket.createdAt)}
        </span>
      </td>
    </tr>
  );
}

export function TicketTable({ data, isLoading, isError, page, onPageChange }: TicketTableProps) {
  const tickets = data?.data || [];
  const totalPages = data?.totalPages || 1;
  const total = data?.total || 0;

  return (
    <div className="table-container" role="region" aria-label="Tickets list">
      <div className="table-wrapper">
        <table className="ticket-table" aria-label="Support tickets">
          <thead>
            <tr className="table-head-row">
              <th scope="col" className="table-th">ID</th>
              <th scope="col" className="table-th">Title / Email</th>
              <th scope="col" className="table-th">Status</th>
              <th scope="col" className="table-th">Channel</th>
              <th scope="col" className="table-th">User</th>
              <th scope="col" className="table-th">Created</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <TableSkeleton rows={8} />
            ) : isError ? (
              <tr>
                <td colSpan={6} className="table-empty">
                  <div className="empty-state">
                    <span className="empty-icon" aria-hidden="true">⚠</span>
                    <p>Failed to load tickets. Please try again.</p>
                  </div>
                </td>
              </tr>
            ) : tickets.length === 0 ? (
              <tr>
                <td colSpan={6} className="table-empty">
                  <div className="empty-state">
                    <span className="empty-icon" aria-hidden="true">📭</span>
                    <p>No tickets found matching your filters.</p>
                  </div>
                </td>
              </tr>
            ) : (
              tickets.map((ticket) => <TicketRow key={ticket.id} ticket={ticket} />)
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {!isLoading && total > 0 && (
        <div className="table-pagination" role="navigation" aria-label="Pagination">
          <div className="pagination-info">
            Showing{' '}
            <strong>{((page - 1) * 10) + 1}–{Math.min(page * 10, total)}</strong>{' '}
            of <strong>{total}</strong> tickets
          </div>
          <div className="pagination-controls">
            <button
              className="pagination-btn"
              onClick={() => onPageChange(page - 1)}
              disabled={page <= 1}
              aria-label="Previous page"
            >
              ‹ Prev
            </button>
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              const pageNum = i + 1;
              return (
                <button
                  key={pageNum}
                  className={`pagination-btn ${page === pageNum ? 'pagination-btn-active' : ''}`}
                  onClick={() => onPageChange(pageNum)}
                  aria-label={`Page ${pageNum}`}
                  aria-current={page === pageNum ? 'page' : undefined}
                >
                  {pageNum}
                </button>
              );
            })}
            <button
              className="pagination-btn"
              onClick={() => onPageChange(page + 1)}
              disabled={page >= totalPages}
              aria-label="Next page"
            >
              Next ›
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
