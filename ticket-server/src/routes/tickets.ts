import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { tickets } from '../data/store';
import { requireAuth, requireAgent, optionalAuth } from '../middleware/auth';
import { broadcast, registerClient } from '../utils/sse';
import type {
  CreateTicketDto,
  UpdateTicketDto,
  AddCommentDto,
  TicketStatus,
  TicketChannel,
  PaginatedTickets,
} from '../types';

const router = Router();

// ─────────────────────────────────────────────
//  SSE Stream endpoint
// ─────────────────────────────────────────────

/**
 * GET /api/tickets/stream
 * Server-Sent Events endpoint for real-time ticket updates.
 * Must be declared BEFORE /:id route to avoid conflict.
 */
router.get('/stream', (req: Request, res: Response) => {
  registerClient(res);
  // Send initial connection event
  res.write('event: connected\ndata: {"message":"Connected to ticket stream"}\n\n');
});

// ─────────────────────────────────────────────
//  List & Search tickets
// ─────────────────────────────────────────────

/**
 * GET /api/tickets
 * Returns paginated, filtered, and searchable list of tickets.
 *
 * Query params:
 *   status    - comma-separated: open,pending,closed
 *   channel   - comma-separated: web,email,messaging
 *   search    - string to match against title, body, or email
 *   page      - page number (default: 1)
 *   limit     - items per page (default: 10)
 */
router.get('/', optionalAuth, (req: Request, res: Response) => {
  const { status, channel, search, page = '1', limit = '10' } = req.query;

  let result = [...tickets];

  // Filter by status
  if (status && typeof status === 'string') {
    const statuses = status.split(',') as TicketStatus[];
    result = result.filter((t) => statuses.includes(t.status));
  }

  // Filter by channel
  if (channel && typeof channel === 'string') {
    const channels = channel.split(',') as TicketChannel[];
    result = result.filter((t) => channels.includes(t.channel));
  }

  // Search by title, body, or email
  if (search && typeof search === 'string') {
    const q = search.toLowerCase().trim();
    result = result.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        t.body.toLowerCase().includes(q) ||
        t.userEmail.toLowerCase().includes(q) ||
        t.userName.toLowerCase().includes(q),
    );
  }

  // Sort by newest first
  result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  // Pagination
  const pageNum = Math.max(1, parseInt(page as string, 10));
  const limitNum = Math.min(50, Math.max(1, parseInt(limit as string, 10)));
  const total = result.length;
  const totalPages = Math.ceil(total / limitNum);
  const startIdx = (pageNum - 1) * limitNum;
  const paginated = result.slice(startIdx, startIdx + limitNum);

  const response: PaginatedTickets = {
    data: paginated,
    total,
    page: pageNum,
    limit: limitNum,
    totalPages,
  };

  res.json(response);
});

// ─────────────────────────────────────────────
//  Get single ticket
// ─────────────────────────────────────────────

/**
 * GET /api/tickets/:id
 * Returns full ticket with all comments.
 */
router.get('/:id', optionalAuth, (req: Request, res: Response) => {
  const ticket = tickets.find((t) => t.id === req.params.id);
  if (!ticket) {
    res.status(404).json({ error: 'Ticket not found' });
    return;
  }
  res.json(ticket);
});

// ─────────────────────────────────────────────
//  Create ticket (any authenticated user)
// ─────────────────────────────────────────────

/**
 * POST /api/tickets
 * Creates a new ticket. Auth required.
 */
router.post('/', requireAuth, (req: Request, res: Response) => {
  const { title, body, channel, userEmail, userName } = req.body as CreateTicketDto;

  if (!title || !body || !channel || !userEmail) {
    res.status(400).json({ error: 'title, body, channel, and userEmail are required' });
    return;
  }

  const validChannels = ['web', 'email', 'messaging'];
  if (!validChannels.includes(channel)) {
    res.status(400).json({ error: `channel must be one of: ${validChannels.join(', ')}` });
    return;
  }

  const now = new Date().toISOString();
  const newTicket = {
    id: `ticket-${uuidv4().slice(0, 8)}`,
    title: title.trim(),
    body: body.trim(),
    status: 'open' as const,
    channel,
    userEmail: userEmail.trim().toLowerCase(),
    userName: (userName || userEmail).trim(),
    assignedAgentId: null,
    tags: [],
    comments: [],
    createdAt: now,
    updatedAt: now,
  };

  tickets.unshift(newTicket);

  broadcast({ type: 'ticket:created', payload: newTicket });

  res.status(201).json(newTicket);
});

// ─────────────────────────────────────────────
//  Update ticket (agents only)
// ─────────────────────────────────────────────

/**
 * PATCH /api/tickets/:id
 * Updates ticket status, assignment, or tags. Agents only.
 */
router.patch('/:id', requireAuth, requireAgent, (req: Request, res: Response) => {
  const ticket = tickets.find((t) => t.id === req.params.id);
  if (!ticket) {
    res.status(404).json({ error: 'Ticket not found' });
    return;
  }

  const { status, assignedAgentId, tags } = req.body as UpdateTicketDto;

  const validStatuses = ['open', 'pending', 'closed'];
  if (status && !validStatuses.includes(status)) {
    res.status(400).json({ error: `status must be one of: ${validStatuses.join(', ')}` });
    return;
  }

  if (status) ticket.status = status;
  if (assignedAgentId !== undefined) ticket.assignedAgentId = assignedAgentId;
  if (tags && Array.isArray(tags)) ticket.tags = tags;
  ticket.updatedAt = new Date().toISOString();

  broadcast({ type: 'ticket:updated', payload: ticket });

  res.json(ticket);
});

// ─────────────────────────────────────────────
//  Add comment to ticket (agents only)
// ─────────────────────────────────────────────

/**
 * POST /api/tickets/:id/comments
 * Adds a reply/comment to a ticket. Agents only.
 */
router.post('/:id/comments', requireAuth, requireAgent, (req: Request, res: Response) => {
  const ticket = tickets.find((t) => t.id === req.params.id);
  if (!ticket) {
    res.status(404).json({ error: 'Ticket not found' });
    return;
  }

  const { body } = req.body as AddCommentDto;
  if (!body || !body.trim()) {
    res.status(400).json({ error: 'Comment body is required' });
    return;
  }

  const comment = {
    id: uuidv4(),
    ticketId: ticket.id,
    authorId: req.user!.id,
    authorName: req.user!.name,
    authorRole: req.user!.role,
    body: body.trim(),
    createdAt: new Date().toISOString(),
  };

  ticket.comments.push(comment);
  ticket.updatedAt = new Date().toISOString();

  broadcast({ type: 'ticket:commented', payload: ticket });

  res.status(201).json(comment);
});

export default router;
