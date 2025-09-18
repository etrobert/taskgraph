import { ReactFlowProvider } from 'reactflow';
import 'reactflow/dist/style.css';
import { TaskGraphFlow } from './components/TaskGraphFlow';
import { ApiStatusIndicator } from './components/ApiStatusIndicator';

function App() {
  return (
    <ReactFlowProvider>
      <ApiStatusIndicator />
      <TaskGraphFlow />
    </ReactFlowProvider>
  );
}

export default App;
