import { ReactFlowProvider } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { TaskGraphFlow } from './components/flow/TaskGraphFlow';
import {
  QueryClient,
  QueryClientProvider,
  useMutation,
} from '@tanstack/react-query';
import { TRPCProvider, useTRPC } from './utils/trpc';
import { SidebarProvider, SidebarTrigger } from './components/ui/sidebar';
import { AppSidebar } from './components/AppSidebar';
import {
  createTRPCClient,
  httpBatchLink,
  splitLink,
  wsLink,
} from '@trpc/client';
import { useState, useEffect, useRef } from 'react';
import superjson from 'superjson';
import { requireEnv } from './utils/requireEnv';
import { createWSClient } from '@trpc/client';
import type { AppRouter } from 'api/src/index';
import {
  SignedIn,
  RedirectToSignIn,
  SignedOut,
  useAuth,
  useUser,
} from '@clerk/clerk-react';

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

function UserSync() {
  const { user } = useUser();
  const trpc = useTRPC();
  const syncUser = useMutation(trpc.syncUser.mutationOptions());
  const hasSynced = useRef(false);

  useEffect(() => {
    if (!user || !user.primaryEmailAddress?.emailAddress || hasSynced.current)
      return;

    hasSynced.current = true;
    syncUser.mutate({
      id: user.id,
      email: user.primaryEmailAddress.emailAddress,
      name: user.fullName,
      imageUrl: user.imageUrl,
    });
  }, [user, syncUser]);

  return null;
}

function AppContent() {
  const { getToken } = useAuth();
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
            headers: async () => {
              const token = await getToken();
              return token ? { Authorization: `Bearer ${token}` } : {};
            },
          }),
        }),
      ],
    });
  });

  return (
    <TRPCProvider trpcClient={trpcClient} queryClient={queryClient}>
      <UserSync />
      <SidebarProvider>
        <ReactFlowProvider>
          <AppSidebar />
          <TaskGraphFlow />
          <SidebarTrigger className="absolute top-2 left-2" />
        </ReactFlowProvider>
      </SidebarProvider>
    </TRPCProvider>
  );
}

function App() {
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <SignedIn>
        <AppContent />
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </QueryClientProvider>
  );
}

export default App;
