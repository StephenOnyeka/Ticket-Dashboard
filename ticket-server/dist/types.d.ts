export type TicketStatus = 'open' | 'pending' | 'closed';
export type TicketChannel = 'web' | 'email' | 'messaging';
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
export interface CreateTicketDto {
    title: string;
    body: string;
    channel: TicketChannel;
    userEmail: string;
    userName: string;
}
export interface UpdateTicketDto {
    status?: TicketStatus;
    assignedAgentId?: string | null;
    tags?: string[];
}
export interface AddCommentDto {
    body: string;
}
export interface LoginDto {
    email: string;
    password: string;
}
export interface LoginResponse {
    token: string;
    user: User;
}
export interface PaginatedTickets {
    data: Ticket[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}
export interface TicketFilters {
    status?: TicketStatus | TicketStatus[];
    channel?: TicketChannel | TicketChannel[];
    search?: string;
    page?: number;
    limit?: number;
}
export interface SSEEvent {
    type: 'ticket:created' | 'ticket:updated' | 'ticket:commented';
    payload: Ticket;
}
//# sourceMappingURL=types.d.ts.map