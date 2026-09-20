import request from 'supertest';
import app from '../index';

// ─────────────────────────────────────────────
//  Ticket API Tests
// ─────────────────────────────────────────────

let agentToken: string;
let guestToken: string;

beforeAll(async () => {
  // Obtain agent token
  const agentRes = await request(app).post('/api/auth/login').send({
    email: 'agent@support.com',
    password: 'agent123',
  });
  agentToken = agentRes.body.token;

  // Obtain guest token
  const guestRes = await request(app).post('/api/auth/login').send({
    email: 'guest@example.com',
    password: 'guest123',
  });
  guestToken = guestRes.body.token;
});

describe('Auth Routes', () => {
  it('POST /api/auth/login — returns token for valid credentials', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'agent@support.com',
      password: 'agent123',
    });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
    expect(res.body.user.role).toBe('agent');
  });

  it('POST /api/auth/login — rejects invalid credentials', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'agent@support.com',
      password: 'wrongpassword',
    });
    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty('error');
  });

  it('GET /api/auth/me — returns user for valid token', async () => {
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${agentToken}`);
    expect(res.status).toBe(200);
    expect(res.body.user.email).toBe('agent@support.com');
  });
});

describe('GET /api/tickets', () => {
  it('returns a paginated list of tickets', async () => {
    const res = await request(app).get('/api/tickets');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('data');
    expect(res.body).toHaveProperty('total');
    expect(res.body).toHaveProperty('page');
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('filters tickets by status=open', async () => {
    const res = await request(app).get('/api/tickets?status=open');
    expect(res.status).toBe(200);
    expect(res.body.data.every((t: { status: string }) => t.status === 'open')).toBe(true);
  });

  it('filters tickets by channel=email', async () => {
    const res = await request(app).get('/api/tickets?channel=email');
    expect(res.status).toBe(200);
    expect(res.body.data.every((t: { channel: string }) => t.channel === 'email')).toBe(true);
  });

  it('searches tickets by keyword', async () => {
    const res = await request(app).get('/api/tickets?search=billing');
    expect(res.status).toBe(200);
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  it('respects pagination params', async () => {
    const res = await request(app).get('/api/tickets?page=1&limit=5');
    expect(res.status).toBe(200);
    expect(res.body.data.length).toBeLessThanOrEqual(5);
    expect(res.body.page).toBe(1);
    expect(res.body.limit).toBe(5);
  });
});

describe('GET /api/tickets/:id', () => {
  it('returns a single ticket by id', async () => {
    const res = await request(app).get('/api/tickets/ticket-001');
    expect(res.status).toBe(200);
    expect(res.body.id).toBe('ticket-001');
    expect(res.body).toHaveProperty('comments');
  });

  it('returns 404 for unknown ticket', async () => {
    const res = await request(app).get('/api/tickets/ticket-999');
    expect(res.status).toBe(404);
  });
});

describe('POST /api/tickets', () => {
  it('creates a new ticket when authenticated', async () => {
    const res = await request(app)
      .post('/api/tickets')
      .set('Authorization', `Bearer ${agentToken}`)
      .send({
        title: 'Test Ticket from Jest',
        body: 'This is a test ticket body',
        channel: 'web',
        userEmail: 'test@example.com',
        userName: 'Test User',
      });
    expect(res.status).toBe(201);
    expect(res.body.title).toBe('Test Ticket from Jest');
    expect(res.body.status).toBe('open');
  });

  it('rejects ticket creation without auth', async () => {
    const res = await request(app).post('/api/tickets').send({
      title: 'Unauthorized Ticket',
      body: 'Should fail',
      channel: 'web',
      userEmail: 'hacker@example.com',
    });
    expect(res.status).toBe(401);
  });
});

describe('PATCH /api/tickets/:id', () => {
  it('allows agent to update ticket status', async () => {
    const res = await request(app)
      .patch('/api/tickets/ticket-002')
      .set('Authorization', `Bearer ${agentToken}`)
      .send({ status: 'pending' });
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('pending');
  });

  it('blocks guest from updating ticket status', async () => {
    const res = await request(app)
      .patch('/api/tickets/ticket-002')
      .set('Authorization', `Bearer ${guestToken}`)
      .send({ status: 'closed' });
    expect(res.status).toBe(403);
  });
});

describe('POST /api/tickets/:id/comments', () => {
  it('allows agent to add a comment', async () => {
    const res = await request(app)
      .post('/api/tickets/ticket-002/comments')
      .set('Authorization', `Bearer ${agentToken}`)
      .send({ body: 'This is a test comment from the agent' });
    expect(res.status).toBe(201);
    expect(res.body.body).toBe('This is a test comment from the agent');
    expect(res.body.authorRole).toBe('agent');
  });

  it('blocks guest from adding comments', async () => {
    const res = await request(app)
      .post('/api/tickets/ticket-002/comments')
      .set('Authorization', `Bearer ${guestToken}`)
      .send({ body: 'Guest trying to comment' });
    expect(res.status).toBe(403);
  });
});
