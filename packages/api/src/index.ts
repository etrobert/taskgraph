import express from 'express';
import { createServer } from 'http';
import { fileURLToPath } from 'node:url';
import { WebSocketServer } from 'ws';
import { applyWSSHandler } from '@trpc/server/adapters/ws';
import { migrate } from 'drizzle-orm/node-postgres/migrator';

import * as trpcExpress from '@trpc/server/adapters/express';

import 'dotenv/config';
import { createContext, createWSContext, db } from './trpc.js';
import { appRouter } from './router.js';

export type AppRouter = typeof appRouter;

// Resolved from this file so src/ under tsx and dist/ under node agree.
const migrationsFolder = fileURLToPath(new URL('../drizzle', import.meta.url));
const webDist = fileURLToPath(new URL('../../web/dist', import.meta.url));

await migrate(db, { migrationsFolder });

const app = express();
const PORT = process.env.PORT || 3001;

// Request logging middleware
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(
      `[${timestamp}] ${res.statusCode} ${req.method} ${req.url} - (${duration}ms)`,
    );
  });

  next();
});

app.use(express.json());

app.use(
  '/trpc',
  trpcExpress.createExpressMiddleware({ router: appRouter, createContext }),
);

app.use('/panel', async (_, res) => {
  if (process.env.NODE_ENV !== 'development')
    return res.status(404).send('Not Found');

  // Dynamically import renderTrpcPanel only in development
  const { renderTrpcPanel } = await import('trpc-ui');

  return res.send(
    renderTrpcPanel(appRouter, {
      url: `http://localhost:${PORT}/trpc`, // Base url of your trpc server
      meta: {
        title: 'My Backend Title',
        description:
          'This is a description of my API, which supports [markdown](https://en.wikipedia.org/wiki/Markdown).',
      },
    }),
  );
});

app.use(express.static(webDist));
app.get('*', (_, res) => res.sendFile(`${webDist}/index.html`));

// Create HTTP server
const server = createServer(app);

// Create WebSocket server attached to the same HTTP server
const wss = new WebSocketServer({ server });

const handler = applyWSSHandler({
  wss,
  router: appRouter,
  createContext: createWSContext,
  // Enable heartbeat messages to keep connection open
  keepAlive: {
    enabled: true,
    pingMs: 30000,
    pongWaitMs: 5000,
  },
});

wss.on('connection', (ws) => {
  console.log(`➕➕ Connection (${wss.clients.size})`);
  ws.once('close', () => {
    console.log(`➖➖ Connection (${wss.clients.size})`);
  });
});

server.listen(PORT, () => {
  console.log(`TaskGraph API server running on port ${PORT}`);
  console.log(`✅ WebSocket Server available at ws://localhost:${PORT}`);
  if (process.env.NODE_ENV !== 'production') {
    console.log(`tRPC UI available at http://localhost:${PORT}/panel`);
  }
});

process.on('SIGTERM', () => {
  console.log('SIGTERM');
  handler.broadcastReconnectNotification();
  wss.close();
  server.close(() => process.exit(0));
  // Upgraded WebSocket sockets would otherwise keep server.close() waiting.
  for (const client of wss.clients) client.terminate();
});
