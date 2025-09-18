import express from 'express';
import cors from 'cors';

import * as trpcExpress from '@trpc/server/adapters/express';

import 'dotenv/config';
import { appRouter, createContext } from './trpc';

export type AppRouter = typeof appRouter;

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

app.use(cors());
app.use(express.json());

app.use(
  '/trpc',
  trpcExpress.createExpressMiddleware({ router: appRouter, createContext }),
);

app.listen(PORT, () =>
  console.log(`TaskGraph API server running on port ${PORT}`),
);
