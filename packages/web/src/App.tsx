import { ReactFlowProvider } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { TaskGraphFlow } from './components/flow/TaskGraphFlow';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TRPCProvider } from './utils/trpc';
import { SidebarProvider, SidebarTrigger } from './components/ui/sidebar';
import { AppSidebar } from './components/AppSidebar';
import { HomeScreen } from './components/HomeScreen';
import { WhoAreYouScreen } from './components/WhoAreYouScreen';
import { useOrganizationId } from './hooks/useOrganizationId';
import { useCurrentUser } from './hooks/useCurrentUser';
import {
  createTRPCClient,
  httpBatchLink,
  splitLink,
  wsLink,
} from '@trpc/client';
import { useState } from 'react';
import { createWSClient } from '@trpc/client';
import type { AppRouter } from 'api/src/index';

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
      url: `${location.protocol === 'https:' ? 'wss' : 'ws'}://${location.host}/trpc`,
      onOpen: () => console.log('🟢 WS Connected'),
      onClose: (cause) => console.log('🔴 WS Disconnected', cause),
    });
    return createTRPCClient<AppRouter>({
      links: [
        splitLink({
          condition: (op) => op.type === 'subscription',
          true: wsLink({
            client: wsClient,
          }),
          false: httpBatchLink({
            url: '/trpc',
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
  const organizationId = useOrganizationId();
  if (organizationId === undefined) return <HomeScreen />;
  return <OrganizationContent organizationId={organizationId} />;
}

function OrganizationContent({ organizationId }: { organizationId: string }) {
  const { users, user, select } = useCurrentUser(organizationId);

  if (users.isLoading) return <div>Loading...</div>;
  if (users.error) return <div>Error: {users.error.message}</div>;

  if (user === undefined)
    return (
      <WhoAreYouScreen
        organizationId={organizationId}
        users={users.data ?? []}
        onSelect={select}
      />
    );

  return (
    <SidebarProvider>
      <ReactFlowProvider>
        <AppSidebar currentUser={user} onSwitchUser={() => select(null)} />
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
