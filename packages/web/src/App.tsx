import { ReactFlowProvider } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { TaskGraphFlow } from './components/TaskGraphFlow';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './utils/trpc';
import { SidebarProvider, SidebarTrigger } from './components/ui/sidebar';
import { AppSidebar } from './components/AppSidebar';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SidebarProvider>
        <ReactFlowProvider>
          <AppSidebar />
          <TaskGraphFlow />
          <SidebarTrigger className="absolute top-2 left-2" />
        </ReactFlowProvider>
      </SidebarProvider>
    </QueryClientProvider>
  );
}

export default App;
