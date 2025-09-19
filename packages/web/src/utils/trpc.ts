import { createTRPCOptionsProxy } from '@trpc/tanstack-react-query';
import type { AppRouter } from '../../../api/src/index.ts';
import {
  createTRPCClient,
  createWSClient,
  httpBatchLink,
  splitLink,
  wsLink,
} from '@trpc/client';
import { QueryClient } from '@tanstack/react-query';

const apiUrl = import.meta.env.VITE_API_URL;
const dev = import.meta.env.DEV;

const wsClient = createWSClient({ url: `${dev ? 'ws' : 'wss'}://${apiUrl}` });

export const queryClient = new QueryClient();
const trpcClient = createTRPCClient<AppRouter>({
  links: [
    splitLink({
      condition: (op) => op.type === 'subscription',
      true: wsLink({ client: wsClient }),
      false: httpBatchLink({
        url: `${dev ? 'http' : 'https'}://${apiUrl}/trpc`,
      }),
    }),
  ],
});

export const trpc = createTRPCOptionsProxy<AppRouter>({
  client: trpcClient,
  queryClient,
});
