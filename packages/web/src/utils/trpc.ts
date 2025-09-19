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

const url = import.meta.env.VITE_API_URL + '/trpc';

// TODO: use right URL
const wsClient = createWSClient({ url: `ws://localhost:3001` });

export const queryClient = new QueryClient();
const trpcClient = createTRPCClient<AppRouter>({
  links: [
    splitLink({
      condition: (op) => op.type === 'subscription',
      true: wsLink({ client: wsClient }),
      false: httpBatchLink({ url }),
    }),
  ],
});

export const trpc = createTRPCOptionsProxy<AppRouter>({
  client: trpcClient,
  queryClient,
});
