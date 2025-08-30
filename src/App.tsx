import ReactFlow, {
  type Node,
  type Edge,
  useNodesState,
  useEdgesState,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { useState, useEffect } from 'react';
import { saveToStorage, loadFromStorage, clearStorage } from './storage';

const defaultNodes: Node[] = [
  {
    id: '1',
    position: { x: 0, y: 0 },
    data: { label: 'Start Task' },
  },
  {
    id: '2',
    position: { x: 0, y: 100 },
    data: { label: 'Process Data' },
  },
  {
    id: '3',
    position: { x: 200, y: 100 },
    data: { label: 'Validate Results' },
  },
  {
    id: '4',
    position: { x: 100, y: 200 },
    data: { label: 'Complete Task' },
  },
];

const defaultEdges: Edge[] = [
  { id: 'e1-2', source: '1', target: '2' },
  { id: 'e2-3', source: '2', target: '3' },
  { id: 'e3-4', source: '3', target: '4' },
  { id: 'e2-4', source: '2', target: '4' },
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
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
      />
      <button
        onClick={handleClearStorage}
        className="absolute bottom-5 right-5 px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded-md transition-colors duration-200 z-10 shadow-lg"
      >
        Clear Storage
      </button>
    </div>
  );
}

export default App;
