import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth';
import ticketRoutes from './routes/tickets';

const app = express();
const PORT = process.env.PORT || 3001;

// ─────────────────────────────────────────────
//  Middleware
// ─────────────────────────────────────────────
app.use(
  cors({
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─────────────────────────────────────────────
//  Routes
// ─────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/tickets', ticketRoutes);

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

export default app;
