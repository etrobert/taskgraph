import { ReactFlowProvider } from 'reactflow';
import 'reactflow/dist/style.css';
import { TaskGraphFlow } from './components/TaskGraphFlow';
import { ApiStatusIndicator } from './components/ApiStatusIndicator';
import { TRPCProvider } from './utils/trpc';
import { useState } from 'react';
import { createTRPCClient, httpBatchLink } from '@trpc/client';
import type { AppRouter } from '../../api/src';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

function App() {
  const [trpcClient] = useState(() =>
    createTRPCClient<AppRouter>({
      links: [httpBatchLink({ url: import.meta.env.VITE_API_URL + '/trpc' })],
    }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <TRPCProvider trpcClient={trpcClient} queryClient={queryClient}>
        <ReactFlowProvider>
          <ApiStatusIndicator />
          <TaskGraphFlow />
        </ReactFlowProvider>
      </TRPCProvider>
    </QueryClientProvider>
  );
}

export default App;
