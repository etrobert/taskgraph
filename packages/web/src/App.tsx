import { ReactFlowProvider } from 'reactflow';
import 'reactflow/dist/style.css';
import { TaskGraphFlow } from './components/TaskGraphFlow';
import { ApiStatusIndicator } from './components/ApiStatusIndicator';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './utils/trpc';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ReactFlowProvider>
        <ApiStatusIndicator />
        <TaskGraphFlow />
      </ReactFlowProvider>
    </QueryClientProvider>
  );
}

export default App;
