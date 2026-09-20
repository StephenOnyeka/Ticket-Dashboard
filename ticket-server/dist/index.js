"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const auth_1 = __importDefault(require("./routes/auth"));
const tickets_1 = __importDefault(require("./routes/tickets"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3001;
// ─────────────────────────────────────────────
//  Middleware
// ─────────────────────────────────────────────
app.use((0, cors_1.default)({
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// ─────────────────────────────────────────────
//  Routes
// ─────────────────────────────────────────────
app.use('/api/auth', auth_1.default);
app.use('/api/tickets', tickets_1.default);
// Health check
app.get('/health', (_, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});
// 404 handler
app.use((_, res) => {
    res.status(404).json({ error: 'Route not found' });
});
// ─────────────────────────────────────────────
//  Start server
// ─────────────────────────────────────────────
app.listen(PORT, () => {
    console.log(`\n🎫 Support Ticket Server running at http://localhost:${PORT}`);
    console.log(`📡 SSE stream available at http://localhost:${PORT}/api/tickets/stream`);
    console.log(`\nDemo accounts:`);
    console.log(`  Agent  → agent@support.com  / agent123`);
    console.log(`  Agent  → admin@support.com  / admin123`);
    console.log(`  Guest  → guest@example.com  / guest123\n`);
});
exports.default = app;
//# sourceMappingURL=index.js.map