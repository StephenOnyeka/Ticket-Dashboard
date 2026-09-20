'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/Input';
import type { TicketStatus, TicketChannel } from '@/lib/types';

// ─────────────────────────────────────────────
//  Ticket Filters Bar
// ─────────────────────────────────────────────

interface TicketFiltersProps {
  onFiltersChange: (filters: {
    status: string;
    channel: string;
    search: string;
  }) => void;
  initialStatus?: string;
  initialChannel?: string;
}

const STATUS_OPTIONS: { value: TicketStatus | ''; label: string }[] = [
  { value: '', label: 'All Statuses' },
  { value: 'open', label: '● Open' },
  { value: 'pending', label: '◐ Pending' },
  { value: 'closed', label: '○ Closed' },
];

const CHANNEL_OPTIONS: { value: TicketChannel | ''; label: string }[] = [
  { value: '', label: 'All Channels' },
  { value: 'web', label: '🌐 Web' },
  { value: 'email', label: '✉️ Email' },
  { value: 'messaging', label: '💬 Messaging' },
];

export function TicketFilters({ onFiltersChange, initialStatus = '', initialChannel = '' }: TicketFiltersProps) {
  const [status, setStatus] = useState(initialStatus);
  const [channel, setChannel] = useState(initialChannel);
  const [search, setSearch] = useState('');
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sync from URL params on mount
  useEffect(() => {
    setStatus(initialStatus);
    setChannel(initialChannel);
  }, [initialStatus, initialChannel]);

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setSearch(value);
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        onFiltersChange({ status, channel, search: value });
      }, 300);
    },
    [status, channel, onFiltersChange],
  );

  const handleStatusChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const value = e.target.value;
      setStatus(value);
      onFiltersChange({ status: value, channel, search });
    },
    [channel, search, onFiltersChange],
  );

  const handleChannelChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const value = e.target.value;
      setChannel(value);
      onFiltersChange({ status, channel: value, search });
    },
    [status, search, onFiltersChange],
  );

  const handleClear = useCallback(() => {
    setStatus('');
    setChannel('');
    setSearch('');
    onFiltersChange({ status: '', channel: '', search: '' });
  }, [onFiltersChange]);

  const hasFilters = status || channel || search;

  return (
    <div className="filters-bar" role="search" aria-label="Filter and search tickets">
      {/* Search */}
      <div className="filters-search">
        <Input
          id="ticket-search"
          type="search"
          placeholder="Search by title, email, or keyword…"
          value={search}
          onChange={handleSearchChange}
          leftIcon={<span aria-hidden="true">⌕</span>}
          aria-label="Search tickets"
        />
      </div>

      {/* Status filter */}
      <div className="filters-select-wrapper">
        <label htmlFor="filter-status" className="sr-only">Filter by status</label>
        <select
          id="filter-status"
          className="filters-select"
          value={status}
          onChange={handleStatusChange}
          aria-label="Filter by status"
        >
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Channel filter */}
      <div className="filters-select-wrapper">
        <label htmlFor="filter-channel" className="sr-only">Filter by channel</label>
        <select
          id="filter-channel"
          className="filters-select"
          value={channel}
          onChange={handleChannelChange}
          aria-label="Filter by channel"
        >
          {CHANNEL_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Clear filters */}
      {hasFilters && (
        <button className="filters-clear" onClick={handleClear} aria-label="Clear all filters">
          Clear ✕
        </button>
      )}
    </div>
  );
}
