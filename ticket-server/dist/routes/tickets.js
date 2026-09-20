"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const uuid_1 = require("uuid");
const store_1 = require("../data/store");
const auth_1 = require("../middleware/auth");
const sse_1 = require("../utils/sse");
const router = (0, express_1.Router)();
// ─────────────────────────────────────────────
//  SSE Stream endpoint
// ─────────────────────────────────────────────
/**
 * GET /api/tickets/stream
 * Server-Sent Events endpoint for real-time ticket updates.
 * Must be declared BEFORE /:id route to avoid conflict.
 */
router.get('/stream', (req, res) => {
    (0, sse_1.registerClient)(res);
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
router.get('/', auth_1.optionalAuth, (req, res) => {
    const { status, channel, search, page = '1', limit = '10' } = req.query;
    let result = [...store_1.tickets];
    // Filter by status
    if (status && typeof status === 'string') {
        const statuses = status.split(',');
        result = result.filter((t) => statuses.includes(t.status));
    }
    // Filter by channel
    if (channel && typeof channel === 'string') {
        const channels = channel.split(',');
        result = result.filter((t) => channels.includes(t.channel));
    }
    // Search by title, body, or email
    if (search && typeof search === 'string') {
        const q = search.toLowerCase().trim();
        result = result.filter((t) => t.title.toLowerCase().includes(q) ||
            t.body.toLowerCase().includes(q) ||
            t.userEmail.toLowerCase().includes(q) ||
            t.userName.toLowerCase().includes(q));
    }
    // Sort by newest first
    result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    // Pagination
    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10)));
    const total = result.length;
    const totalPages = Math.ceil(total / limitNum);
    const startIdx = (pageNum - 1) * limitNum;
    const paginated = result.slice(startIdx, startIdx + limitNum);
    const response = {
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
router.get('/:id', auth_1.optionalAuth, (req, res) => {
    const ticket = store_1.tickets.find((t) => t.id === req.params.id);
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
router.post('/', auth_1.requireAuth, (req, res) => {
    const { title, body, channel, userEmail, userName } = req.body;
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
        id: `ticket-${(0, uuid_1.v4)().slice(0, 8)}`,
        title: title.trim(),
        body: body.trim(),
        status: 'open',
        channel,
        userEmail: userEmail.trim().toLowerCase(),
        userName: (userName || userEmail).trim(),
        assignedAgentId: null,
        tags: [],
        comments: [],
        createdAt: now,
        updatedAt: now,
    };
    store_1.tickets.unshift(newTicket);
    (0, sse_1.broadcast)({ type: 'ticket:created', payload: newTicket });
    res.status(201).json(newTicket);
});
// ─────────────────────────────────────────────
//  Update ticket (agents only)
// ─────────────────────────────────────────────
/**
 * PATCH /api/tickets/:id
 * Updates ticket status, assignment, or tags. Agents only.
 */
router.patch('/:id', auth_1.requireAuth, auth_1.requireAgent, (req, res) => {
    const ticket = store_1.tickets.find((t) => t.id === req.params.id);
    if (!ticket) {
        res.status(404).json({ error: 'Ticket not found' });
        return;
    }
    const { status, assignedAgentId, tags } = req.body;
    const validStatuses = ['open', 'pending', 'closed'];
    if (status && !validStatuses.includes(status)) {
        res.status(400).json({ error: `status must be one of: ${validStatuses.join(', ')}` });
        return;
    }
    if (status)
        ticket.status = status;
    if (assignedAgentId !== undefined)
        ticket.assignedAgentId = assignedAgentId;
    if (tags && Array.isArray(tags))
        ticket.tags = tags;
    ticket.updatedAt = new Date().toISOString();
    (0, sse_1.broadcast)({ type: 'ticket:updated', payload: ticket });
    res.json(ticket);
});
// ─────────────────────────────────────────────
//  Add comment to ticket (agents only)
// ─────────────────────────────────────────────
/**
 * POST /api/tickets/:id/comments
 * Adds a reply/comment to a ticket. Agents only.
 */
router.post('/:id/comments', auth_1.requireAuth, auth_1.requireAgent, (req, res) => {
    const ticket = store_1.tickets.find((t) => t.id === req.params.id);
    if (!ticket) {
        res.status(404).json({ error: 'Ticket not found' });
        return;
    }
    const { body } = req.body;
    if (!body || !body.trim()) {
        res.status(400).json({ error: 'Comment body is required' });
        return;
    }
    const comment = {
        id: (0, uuid_1.v4)(),
        ticketId: ticket.id,
        authorId: req.user.id,
        authorName: req.user.name,
        authorRole: req.user.role,
        body: body.trim(),
        createdAt: new Date().toISOString(),
    };
    ticket.comments.push(comment);
    ticket.updatedAt = new Date().toISOString();
    (0, sse_1.broadcast)({ type: 'ticket:commented', payload: ticket });
    res.status(201).json(comment);
});
exports.default = router;
//# sourceMappingURL=tickets.js.map