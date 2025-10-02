import { createTRPCContext } from '@trpc/tanstack-react-query';
import type { AppRouter } from '../../../api/src/index.ts';

export const { TRPCProvider, useTRPC, useTRPCClient } =
  createTRPCContext<AppRouter>();
