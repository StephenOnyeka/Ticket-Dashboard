'use client';

import { useEffect } from 'react';
import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryKey,
} from '@tanstack/react-query';
import {
  getTickets,
  getTicket,
  createTicket,
  updateTicket,
  addComment,
} from '../api';
import type { TicketFilters, CreateTicketPayload, UpdateTicketPayload, AddCommentPayload } from '../types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// ─────────────────────────────────────────────
//  Query Keys
// ─────────────────────────────────────────────

export const ticketKeys = {
  all: ['tickets'] as QueryKey,
  lists: () => ['tickets', 'list'] as QueryKey,
  list: (filters: TicketFilters) => ['tickets', 'list', filters] as QueryKey,
  detail: (id: string) => ['tickets', 'detail', id] as QueryKey,
};

// ─────────────────────────────────────────────
//  Hooks
// ─────────────────────────────────────────────

export function useTickets(filters: TicketFilters = {}) {
  return useQuery({
    queryKey: ticketKeys.list(filters),
    queryFn: () => getTickets(filters),
    staleTime: 10_000, // 10 seconds
  });
}

export function useTicket(id: string) {
  return useQuery({
    queryKey: ticketKeys.detail(id),
    queryFn: () => getTicket(id),
    enabled: !!id,
    staleTime: 10_000,
  });
}

export function useCreateTicket() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateTicketPayload) => createTicket(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ticketKeys.lists() });
    },
  });
}

export function useUpdateTicket() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateTicketPayload }) =>
      updateTicket(id, payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ticketKeys.lists() });
      queryClient.setQueryData(ticketKeys.detail(data.id), data);
    },
  });
}

export function useAddComment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: AddCommentPayload }) =>
      addComment(id, payload),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ticketKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: ticketKeys.lists() });
    },
  });
}

// ─────────────────────────────────────────────
//  Real-time: SSE stream hook
// ─────────────────────────────────────────────

/**
 * Subscribes to the SSE stream and invalidates relevant queries
 * when ticket events arrive.
 */
export function useTicketStream(enabled = true) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return;

    let eventSource: EventSource;
    let reconnectTimeout: ReturnType<typeof setTimeout>;

    function connect() {
      eventSource = new EventSource(`${API_BASE}/api/tickets/stream`);

      eventSource.addEventListener('ticket:created', () => {
        queryClient.invalidateQueries({ queryKey: ticketKeys.lists() });
      });

      eventSource.addEventListener('ticket:updated', (e: MessageEvent) => {
        const ticket = JSON.parse(e.data);
        queryClient.invalidateQueries({ queryKey: ticketKeys.lists() });
        queryClient.invalidateQueries({ queryKey: ticketKeys.detail(ticket.id) });
      });

      eventSource.addEventListener('ticket:commented', (e: MessageEvent) => {
        const ticket = JSON.parse(e.data);
        queryClient.invalidateQueries({ queryKey: ticketKeys.detail(ticket.id) });
      });

      eventSource.onerror = () => {
        eventSource.close();
        // Reconnect after 5 seconds
        reconnectTimeout = setTimeout(connect, 5000);
      };
    }

    connect();

    return () => {
      eventSource?.close();
      clearTimeout(reconnectTimeout);
    };
  }, [queryClient, enabled]);
}
