import { createTRPCContext } from '@trpc/tanstack-react-query';
import type { inferRouterOutputs } from '@trpc/server';
import type { AppRouter } from 'api/src/index.ts';

export const { TRPCProvider, useTRPC, useTRPCClient } =
  createTRPCContext<AppRouter>();

// What the wire carries: plain JSON, so dates arrive as ISO strings.
type Outputs = inferRouterOutputs<AppRouter>;
export type Organization = Outputs['organizations'][number];
export type User = Outputs['users'][number];
export type Task = Outputs['graph']['tasks'][number];
export type Project = Outputs['graph']['projects'][number];
