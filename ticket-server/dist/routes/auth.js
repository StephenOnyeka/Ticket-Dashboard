"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const uuid_1 = require("uuid");
const store_1 = require("../data/store");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
/**
 * POST /api/auth/login
 * Authenticates a user and returns a Bearer token.
 */
router.post('/login', (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(400).json({ error: 'Email and password are required' });
        return;
    }
    const storedPassword = store_1.credentials[email];
    if (!storedPassword || storedPassword !== password) {
        res.status(401).json({ error: 'Invalid email or password' });
        return;
    }
    const user = store_1.users.find((u) => u.email === email);
    if (!user) {
        res.status(401).json({ error: 'User not found' });
        return;
    }
    // Generate a simple token
    const token = (0, uuid_1.v4)();
    store_1.tokenStore.set(token, user.id);
    res.json({ token, user });
});
/**
 * POST /api/auth/logout
 * Invalidates the current Bearer token.
 */
router.post('/logout', auth_1.requireAuth, (req, res) => {
    const authHeader = req.headers.authorization;
    const token = authHeader.slice(7);
    store_1.tokenStore.delete(token);
    res.json({ message: 'Logged out successfully' });
});
/**
 * GET /api/auth/me
 * Returns the currently authenticated user's info.
 */
router.get('/me', auth_1.requireAuth, (req, res) => {
    res.json({ user: req.user });
});
exports.default = router;
//# sourceMappingURL=auth.js.map