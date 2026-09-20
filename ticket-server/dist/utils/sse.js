"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerClient = registerClient;
exports.broadcast = broadcast;
exports.getClientCount = getClientCount;
// ─────────────────────────────────────────────
//  SSE Broadcaster
// ─────────────────────────────────────────────
// Set of all currently connected SSE clients
const clients = new Set();
/**
 * Register a new SSE client connection.
 * Sets appropriate SSE headers and keeps the connection alive.
 */
function registerClient(res) {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no');
    res.flushHeaders();
    // Send a keep-alive comment every 20 seconds
    const keepAlive = setInterval(() => {
        res.write(': keep-alive\n\n');
    }, 20000);
    clients.add(res);
    res.on('close', () => {
        clearInterval(keepAlive);
        clients.delete(res);
    });
}
/**
 * Broadcast an SSE event to all connected clients.
 */
function broadcast(event) {
    const payload = `event: ${event.type}\ndata: ${JSON.stringify(event.payload)}\n\n`;
    for (const client of clients) {
        client.write(payload);
    }
}
/**
 * Returns the current number of connected SSE clients.
 */
function getClientCount() {
    return clients.size;
}
//# sourceMappingURL=sse.js.map