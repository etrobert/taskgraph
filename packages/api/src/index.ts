import express from 'express';
import cors from 'cors';

import { publicProcedure } from './trpc.js';
import * as trpcExpress from '@trpc/server/adapters/express';
import { initTRPC } from '@trpc/server';

// created for each request
const createContext = ({}: trpcExpress.CreateExpressContextOptions) => ({}); // no context
type Context = Awaited<ReturnType<typeof createContext>>;

const t = initTRPC.context<Context>().create();
const appRouter = t.router({
  health: publicProcedure.query(() => 'ok'),
});

export type AppRouter = typeof appRouter;

const app = express();
const PORT = process.env.PORT || 3001;

// Request logging middleware
app.use((req, _res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.url}`);
  next();
});

app.use(cors());
app.use(express.json());

app.use(
  '/trpc',
  trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext,
  }),
);

app.get('/api/tasks', (_req, res) => {
  // Placeholder for tasks endpoint
  res.json({
    tasks: [],
    message: 'Tasks API endpoint - ready for implementation',
  });
});

app.listen(PORT, () => {
  console.log(`TaskGraph API server running on port ${PORT}`);
});
