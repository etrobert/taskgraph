import { ReactFlowProvider } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { TaskGraphFlow } from './components/flow/TaskGraphFlow';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TRPCProvider } from './utils/trpc';
import { SidebarProvider, SidebarTrigger } from './components/ui/sidebar';
import { AppSidebar } from './components/AppSidebar';
import {
  createTRPCClient,
  httpBatchLink,
  splitLink,
  wsLink,
} from '@trpc/client';
import { useState } from 'react';
import superjson from 'superjson';
import { requireEnv } from './utils/requireEnv';
import { createWSClient } from '@trpc/client';
import type { AppRouter } from '../../api/src/index';

const apiUrl = requireEnv('VITE_API_URL');
const dev = import.meta.env.DEV;

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: { queries: { staleTime: 60 * 1000 } },
  });
}

let browserQueryClient: QueryClient | undefined = undefined;

function getQueryClient() {
  if (typeof window === 'undefined') {
    return makeQueryClient();
  } else {
    if (!browserQueryClient) browserQueryClient = makeQueryClient();
    return browserQueryClient;
  }
}

function App() {
  const queryClient = getQueryClient();
  const [trpcClient] = useState(() => {
    const wsClient = createWSClient({
      url: `${dev ? 'ws' : 'wss'}://${apiUrl}`,
    });
    return createTRPCClient<AppRouter>({
      links: [
        splitLink({
          condition: (op) => op.type === 'subscription',
          true: wsLink({ client: wsClient, transformer: superjson }),
          false: httpBatchLink({
            url: `${dev ? 'http' : 'https'}://${apiUrl}/trpc`,
            transformer: superjson,
          }),
        }),
      ],
    });
  });

  return (
    <QueryClientProvider client={queryClient}>
      <TRPCProvider trpcClient={trpcClient} queryClient={queryClient}>
        <SidebarProvider>
          <ReactFlowProvider>
            <AppSidebar />
            <TaskGraphFlow />
            <SidebarTrigger className="absolute top-2 left-2" />
          </ReactFlowProvider>
        </SidebarProvider>
      </TRPCProvider>
    </QueryClientProvider>
  );
}

export default App;
