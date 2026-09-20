"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuth = requireAuth;
exports.requireAgent = requireAgent;
exports.optionalAuth = optionalAuth;
const store_1 = require("../data/store");
/**
 * Middleware: extracts and validates the Bearer token.
 * Attaches `req.user` if valid; otherwise returns 401.
 */
function requireAuth(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ error: 'Missing or invalid Authorization header' });
        return;
    }
    const token = authHeader.slice(7);
    const userId = store_1.tokenStore.get(token);
    if (!userId) {
        res.status(401).json({ error: 'Invalid or expired token' });
        return;
    }
    const user = store_1.users.find((u) => u.id === userId);
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
function requireAgent(req, res, next) {
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
function optionalAuth(req, res, next) {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.slice(7);
        const userId = store_1.tokenStore.get(token);
        if (userId) {
            const user = store_1.users.find((u) => u.id === userId);
            if (user)
                req.user = user;
        }
    }
    next();
}
//# sourceMappingURL=auth.js.map