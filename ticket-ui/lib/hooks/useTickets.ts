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
import type { TicketFilters, CreateTicketPayload, UpdateTicketPayload, AddCommentPayload, Ticket } from '../types';

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
    staleTime: 10_000,
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

/**
 * Optimistic update hook for updating ticket status, assigned agent, or tags.
 */
export function useUpdateTicket() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateTicketPayload }) =>
      updateTicket(id, payload),

    onMutate: async ({ id, payload }) => {
      // Cancel outgoing fetches so they don't overwrite optimistic update
      await queryClient.cancelQueries({ queryKey: ticketKeys.detail(id) });
      await queryClient.cancelQueries({ queryKey: ticketKeys.lists() });

      // Snapshot previous value
      const previousTicket = queryClient.getQueryData<Ticket>(ticketKeys.detail(id));

      // Optimistically update detail cache
      if (previousTicket) {
        queryClient.setQueryData<Ticket>(ticketKeys.detail(id), {
          ...previousTicket,
          ...payload,
          updatedAt: new Date().toISOString(),
        });
      }

      return { previousTicket };
    },

    onError: (_err, { id }, context) => {
      if (context?.previousTicket) {
        queryClient.setQueryData(ticketKeys.detail(id), context.previousTicket);
      }
    },

    onSettled: (_data, _error, { id }) => {
      queryClient.invalidateQueries({ queryKey: ticketKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: ticketKeys.lists() });
    },
  });
}

/**
 * Optimistic update hook for adding comments to a ticket.
 */
export function useAddComment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: AddCommentPayload }) =>
      addComment(id, payload),

    onMutate: async ({ id, payload }) => {
      await queryClient.cancelQueries({ queryKey: ticketKeys.detail(id) });
      const previousTicket = queryClient.getQueryData<Ticket>(ticketKeys.detail(id));

      if (previousTicket) {
        const optimisticComment = {
          id: `temp-${Date.now()}`,
          ticketId: id,
          authorId: 'me',
          authorName: 'Agent',
          authorRole: 'agent' as const,
          body: payload.body,
          createdAt: new Date().toISOString(),
        };

        queryClient.setQueryData<Ticket>(ticketKeys.detail(id), {
          ...previousTicket,
          comments: [...previousTicket.comments, optimisticComment],
          updatedAt: new Date().toISOString(),
        });
      }

      return { previousTicket };
    },

    onError: (_err, { id }, context) => {
      if (context?.previousTicket) {
        queryClient.setQueryData(ticketKeys.detail(id), context.previousTicket);
      }
    },

    onSettled: (_data, _error, { id }) => {
      queryClient.invalidateQueries({ queryKey: ticketKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: ticketKeys.lists() });
    },
  });
}

// ─────────────────────────────────────────────
//  Real-time: SSE stream hook
// ─────────────────────────────────────────────

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
