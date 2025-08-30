import ReactFlow, {
  type Node,
  type Edge,
  useNodesState,
  useEdgesState,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { useState, useEffect } from 'react';
import { saveToStorage, loadFromStorage, clearStorage } from './storage';
import { TaskNode } from './components/TaskNode';

const nodeTypes = {
  task: TaskNode,
};

const defaultNodes: Node[] = [
  // Starting tasks (leftmost)
  {
    id: '1',
    type: 'task',
    position: { x: 0, y: 50 },
    data: { label: 'Research Requirements', status: 'completed' },
  },
  {
    id: '2',
    type: 'task',
    position: { x: 0, y: 150 },
    data: { label: 'Gather Resources', status: 'completed' },
  },
  {
    id: '3',
    type: 'task',
    position: { x: 0, y: 250 },
    data: { label: 'Setup Environment', status: 'in-progress' },
  },
  // Intermediate tasks (middle)
  {
    id: '4',
    type: 'task',
    position: { x: 250, y: 100 },
    data: { label: 'Design System', status: 'in-progress' },
  },
  {
    id: '5',
    type: 'task',
    position: { x: 250, y: 200 },
    data: { label: 'Implement Features', status: 'pending' },
  },
  // Final goal (rightmost)
  {
    id: '6',
    type: 'task',
    position: { x: 500, y: 150 },
    data: { label: 'Launch Product', status: 'pending' },
  },
];

const defaultEdges: Edge[] = [
  // Dependencies point to tasks that depend on them
  { id: 'e1-4', source: '1', target: '4' }, // Research Requirements → Design System
  { id: 'e2-4', source: '2', target: '4' }, // Gather Resources → Design System  
  { id: 'e2-5', source: '2', target: '5' }, // Gather Resources → Implement Features
  { id: 'e3-5', source: '3', target: '5' }, // Setup Environment → Implement Features
  // Intermediate dependencies point to final goal
  { id: 'e4-6', source: '4', target: '6' }, // Design System → Launch Product
  { id: 'e5-6', source: '5', target: '6' }, // Implement Features → Launch Product
];

function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load data on startup
  useEffect(() => {
    const savedData = loadFromStorage();
    if (savedData) {
      setNodes(savedData.nodes);
      setEdges(savedData.edges);
    } else {
      setNodes(defaultNodes);
      setEdges(defaultEdges);
    }
    setIsLoaded(true);
  }, [setNodes, setEdges]);

  // Auto-save when nodes or edges change
  useEffect(() => {
    if (isLoaded) saveToStorage(nodes, edges);
  }, [nodes, edges, isLoaded]);

  const handleClearStorage = () => {
    clearStorage();
    setNodes(defaultNodes);
    setEdges(defaultEdges);
  };

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
      />
      <button
        onClick={handleClearStorage}
        className="absolute right-5 bottom-5 z-10 rounded-md bg-red-500 px-4 py-2 text-sm font-medium text-white shadow-lg transition-colors duration-200 hover:bg-red-600"
      >
        Clear Storage
      </button>
    </div>
  );
}

export default App;
