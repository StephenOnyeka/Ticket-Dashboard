// ─────────────────────────────────────────────
//  Shared TypeScript types (mirrors backend)
// ─────────────────────────────────────────────

export type TicketStatus = 'open' | 'pending' | 'closed';
export type TicketChannel = 'web' | 'email' | 'messaging';
export type TicketPriority = 'urgent' | 'high' | 'medium' | 'low';
export type UserRole = 'agent' | 'guest';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatarInitials: string;
}

export interface Comment {
  id: string;
  ticketId: string;
  authorId: string;
  authorName: string;
  authorRole: UserRole;
  body: string;
  createdAt: string;
}

export interface Ticket {
  id: string;
  title: string;
  body: string;
  status: TicketStatus;
  channel: TicketChannel;
  userEmail: string;
  userName: string;
  assignedAgentId: string | null;
  tags: string[];
  comments: Comment[];
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedTickets {
  data: Ticket[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface TicketFilters {
  status?: string;
  channel?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface CreateTicketPayload {
  title: string;
  body: string;
  channel: TicketChannel;
  userEmail: string;
  userName: string;
}

export interface UpdateTicketPayload {
  status?: TicketStatus;
  assignedAgentId?: string | null;
  tags?: string[];
}

export interface AddCommentPayload {
  body: string;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}
