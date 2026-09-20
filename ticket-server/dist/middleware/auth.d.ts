import { Request, Response, NextFunction } from 'express';
import type { User } from '../types';
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
export declare function requireAuth(req: Request, res: Response, next: NextFunction): void;
/**
 * Middleware: requires the authenticated user to have the 'agent' role.
 * Must be used AFTER requireAuth.
 */
export declare function requireAgent(req: Request, res: Response, next: NextFunction): void;
/**
 * Optional auth middleware — does NOT block unauthenticated requests,
 * but attaches user if a valid token is present.
 */
export declare function optionalAuth(req: Request, res: Response, next: NextFunction): void;
//# sourceMappingURL=auth.d.ts.map