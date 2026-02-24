import { ReactFlowProvider } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { TaskGraphFlow } from './components/flow/TaskGraphFlow';
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from '@tanstack/react-query';
import { TRPCProvider, useTRPC } from './utils/trpc';
import { SidebarProvider, SidebarTrigger } from './components/ui/sidebar';
import { AppSidebar } from './components/AppSidebar';
import { SignupScreen } from './components/SignupScreen';
import { LoginScreen } from './components/LoginScreen';
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
import type { AppRouter } from 'api/src/index';

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

function TrpcWrapper() {
  const queryClient = getQueryClient();
  const [trpcClient] = useState(() => {
    // For now, WebSocket connections are not authenticated
    const wsClient = createWSClient({
      url: `${dev ? 'ws' : 'wss'}://${apiUrl}`,
      onOpen: () => console.log('🟢 WS Connected'),
      onClose: (cause) => console.log('🔴 WS Disconnected', cause),
    });
    return createTRPCClient<AppRouter>({
      links: [
        splitLink({
          condition: (op) => op.type === 'subscription',
          true: wsLink({
            client: wsClient,
            transformer: superjson,
          }),
          false: httpBatchLink({
            url: `${dev ? 'http' : 'https'}://${apiUrl}/trpc`,
            transformer: superjson,
            fetch(url, options) {
              return fetch(url, { ...options, credentials: 'include' });
            },
          }),
        }),
      ],
    });
  });

  return (
    <TRPCProvider trpcClient={trpcClient} queryClient={queryClient}>
      <AppContent />
    </TRPCProvider>
  );
}

function AppContent() {
  const trpc = useTRPC();
  const me = useQuery(trpc.me.queryOptions());
  const showSignup = false; // TODO: Implement

  if (me.isLoading) return <div>Loading...</div>;
  if (me.error) return <div>Error: {me.error.message}</div>;

  // Not logged in
  if (me.data === null) return showSignup ? <SignupScreen /> : <LoginScreen />;

  return (
    <SidebarProvider>
      <ReactFlowProvider>
        <AppSidebar />
        <TaskGraphFlow />
        <SidebarTrigger className="absolute top-2 left-2" />
      </ReactFlowProvider>
    </SidebarProvider>
  );
}

function App() {
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <TrpcWrapper />
    </QueryClientProvider>
  );
}

export default App;
