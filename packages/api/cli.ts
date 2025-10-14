#!/usr/bin/env npx tsx
import 'dotenv/config';
import { createCli } from 'trpc-cli';
import { appRouter } from './src/router.js';

// Create and run the CLI
createCli({
  router: appRouter,
  context: { auth: null },
}).run();
