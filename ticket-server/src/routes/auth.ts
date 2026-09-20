import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { users, credentials, tokenStore } from '../data/store';
import { requireAuth } from '../middleware/auth';
import type { LoginDto } from '../types';

const router = Router();

/**
 * POST /api/auth/login
 * Authenticates a user and returns a Bearer token.
 */
router.post('/login', (req: Request, res: Response) => {
  const { email, password } = req.body as LoginDto;

  if (!email || !password) {
    res.status(400).json({ error: 'Email and password are required' });
    return;
  }

  const storedPassword = credentials[email];
  if (!storedPassword || storedPassword !== password) {
    res.status(401).json({ error: 'Invalid email or password' });
    return;
  }

  const user = users.find((u) => u.email === email);
  if (!user) {
    res.status(401).json({ error: 'User not found' });
    return;
  }

  // Generate a simple token
  const token = uuidv4();
  tokenStore.set(token, user.id);

  res.json({ token, user });
});

/**
 * POST /api/auth/logout
 * Invalidates the current Bearer token.
 */
router.post('/logout', requireAuth, (req: Request, res: Response) => {
  const authHeader = req.headers.authorization!;
  const token = authHeader.slice(7);
  tokenStore.delete(token);
  res.json({ message: 'Logged out successfully' });
});

/**
 * GET /api/auth/me
 * Returns the currently authenticated user's info.
 */
router.get('/me', requireAuth, (req: Request, res: Response) => {
  res.json({ user: req.user });
});

export default router;
