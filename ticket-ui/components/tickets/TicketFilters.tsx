'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { SearchNormal1, CloseCircle } from 'iconsax-react';
import type { TicketStatus, TicketChannel } from '@/lib/types';

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
  { value: 'open', label: 'Open' },
  { value: 'pending', label: 'Pending' },
  { value: 'closed', label: 'Closed' },
];

const CHANNEL_OPTIONS: { value: TicketChannel | ''; label: string }[] = [
  { value: '', label: 'All Channels' },
  { value: 'web', label: 'Web' },
  { value: 'email', label: 'Email' },
  { value: 'messaging', label: 'Messaging' },
];

export function TicketFilters({ onFiltersChange, initialStatus = '', initialChannel = '' }: TicketFiltersProps) {
  const [status, setStatus] = useState(initialStatus);
  const [channel, setChannel] = useState(initialChannel);
  const [search, setSearch] = useState('');
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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
    <div className="flex flex-col sm:flex-row items-center gap-3 mb-6 p-4 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 backdrop-blur-md shadow-xs transition-colors duration-200" role="search" aria-label="Filter and search tickets">
      {/* Search Input */}
      <div className="relative flex-1 w-full">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
          <SearchNormal1 size={18} variant="Linear" color="currentColor" />
        </div>
        <input
          id="ticket-search"
          type="search"
          placeholder="Search by title, email, or keyword…"
          value={search}
          onChange={handleSearchChange}
          aria-label="Search tickets"
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 text-xs font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
        />
      </div>

      {/* Status Filter */}
      <div className="w-full sm:w-44">
        <label htmlFor="filter-status" className="sr-only">Filter by status</label>
        <select
          id="filter-status"
          value={status}
          onChange={handleStatusChange}
          aria-label="Filter by status"
          className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all cursor-pointer"
        >
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Channel Filter */}
      <div className="w-full sm:w-44">
        <label htmlFor="filter-channel" className="sr-only">Filter by channel</label>
        <select
          id="filter-channel"
          value={channel}
          onChange={handleChannelChange}
          aria-label="Filter by channel"
          className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all cursor-pointer"
        >
          {CHANNEL_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Clear Filters */}
      {hasFilters && (
        <button
          onClick={handleClear}
          aria-label="Clear all filters"
          className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/20 transition-all shrink-0"
        >
          <CloseCircle size={16} variant="Linear" color="currentColor" />
          <span>Clear</span>
        </button>
      )}
    </div>
  );
}
