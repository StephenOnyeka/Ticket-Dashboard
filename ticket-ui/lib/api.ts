import type {
  LoginResponse,
  PaginatedTickets,
  Ticket,
  Comment,
  TicketFilters,
  CreateTicketPayload,
  UpdateTicketPayload,
  AddCommentPayload,
  User,
} from './types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// ─────────────────────────────────────────────
//  HTTP utility
// ─────────────────────────────────────────────

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('ticket_token');
}

async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });

  if (!res.ok) {
    const errBody = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(errBody.error || `Request failed: ${res.status}`);
  }

  return res.json() as Promise<T>;
}

// ─────────────────────────────────────────────
//  Auth API
// ─────────────────────────────────────────────

export async function login(email: string, password: string): Promise<LoginResponse> {
  return apiFetch<LoginResponse>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export async function logout(): Promise<void> {
  await apiFetch<void>('/api/auth/logout', { method: 'POST' }).catch(() => {
    // Swallow errors — we'll clear local state anyway
  });
}

export async function getMe(): Promise<{ user: User }> {
  return apiFetch<{ user: User }>('/api/auth/me');
}

// ─────────────────────────────────────────────
//  Ticket API
// ─────────────────────────────────────────────

export async function getTickets(filters: TicketFilters = {}): Promise<PaginatedTickets> {
  const params = new URLSearchParams();
  if (filters.status) params.set('status', filters.status);
  if (filters.channel) params.set('channel', filters.channel);
  if (filters.search) params.set('search', filters.search);
  if (filters.page) params.set('page', String(filters.page));
  if (filters.limit) params.set('limit', String(filters.limit));

  const query = params.toString() ? `?${params.toString()}` : '';
  return apiFetch<PaginatedTickets>(`/api/tickets${query}`);
}

export async function getTicket(id: string): Promise<Ticket> {
  return apiFetch<Ticket>(`/api/tickets/${id}`);
}

export async function createTicket(payload: CreateTicketPayload): Promise<Ticket> {
  return apiFetch<Ticket>('/api/tickets', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function updateTicket(id: string, payload: UpdateTicketPayload): Promise<Ticket> {
  return apiFetch<Ticket>(`/api/tickets/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
}

export async function addComment(id: string, payload: AddCommentPayload): Promise<Comment> {
  return apiFetch<Comment>(`/api/tickets/${id}/comments`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}
