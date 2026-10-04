#!/usr/bin/env -S npx tsx
import 'dotenv/config';
import { createCli, lineByLineConsoleLogger } from 'trpc-cli';
import { appRouter } from './src/router.js';

// The default yaml/table logger prints Date fields as {}
createCli({ router: appRouter }).run({ logger: lineByLineConsoleLogger });
