import { ReactFlowProvider } from 'reactflow';
import 'reactflow/dist/style.css';
import { TaskGraphFlow } from './components/TaskGraphFlow';

function App() {
  return (
    <ReactFlowProvider>
      <TaskGraphFlow />
    </ReactFlowProvider>
  );
}

export default App;
