import { Request, Response, NextFunction } from 'express';
import { tokenStore, users } from '../data/store';
import type { User } from '../types';

// Extend Express Request to carry the authenticated user
declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

/**
 * Middleware: extracts and validates the Bearer token.
 * Attaches `req.user` if valid; otherwise returns 401.
 */
export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Missing or invalid Authorization header' });
    return;
  }

  const token = authHeader.slice(7);
  const userId = tokenStore.get(token);

  if (!userId) {
    res.status(401).json({ error: 'Invalid or expired token' });
    return;
  }

  const user = users.find((u) => u.id === userId);
  if (!user) {
    res.status(401).json({ error: 'User not found' });
    return;
  }

  req.user = user;
  next();
}

/**
 * Middleware: requires the authenticated user to have the 'agent' role.
 * Must be used AFTER requireAuth.
 */
export function requireAgent(req: Request, res: Response, next: NextFunction): void {
  if (!req.user) {
    res.status(401).json({ error: 'Not authenticated' });
    return;
  }

  if (req.user.role !== 'agent') {
    res.status(403).json({ error: 'Agents only — access denied' });
    return;
  }

  next();
}

/**
 * Optional auth middleware — does NOT block unauthenticated requests,
 * but attaches user if a valid token is present.
 */
export function optionalAuth(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.slice(7);
    const userId = tokenStore.get(token);
    if (userId) {
      const user = users.find((u) => u.id === userId);
      if (user) req.user = user;
    }
  }
  next();
}
