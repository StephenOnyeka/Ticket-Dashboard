import { Response } from 'express';
import type { SSEEvent } from '../types';
/**
 * Register a new SSE client connection.
 * Sets appropriate SSE headers and keeps the connection alive.
 */
export declare function registerClient(res: Response): void;
/**
 * Broadcast an SSE event to all connected clients.
 */
export declare function broadcast(event: SSEEvent): void;
/**
 * Returns the current number of connected SSE clients.
 */
export declare function getClientCount(): number;
//# sourceMappingURL=sse.d.ts.map