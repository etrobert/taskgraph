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

app.listen(PORT, () => {
  console.log(`TaskGraph API server running on port ${PORT}`);
  if (process.env.NODE_ENV !== 'production') {
    console.log(`tRPC UI available at http://localhost:${PORT}/panel`);
  }
});
