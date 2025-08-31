import ReactFlow, {
  type Node,
  type Edge,
  useNodesState,
  useEdgesState,
  MarkerType,
  useReactFlow,
  ReactFlowProvider,
  type OnConnectEnd,
  type OnConnectStart,
  type OnConnect,
  addEdge,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { useState, useEffect, useCallback } from 'react';
import { saveToStorage, loadFromStorage, clearStorage } from './storage';
import { TaskNode } from './components/TaskNode';
import { defaultNodes, defaultEdges } from './defaults';

const nodeTypes = {
  task: TaskNode,
};

let id = 0;
const getId = () => `dndnode_${id++}`;

function TaskGraphFlow() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [connectingNodeId, setConnectingNodeId] = useState<string | null>(null);
  const [connectingHandleType, setConnectingHandleType] = useState<
    'source' | 'target' | null
  >(null);
  const [showArchived, setShowArchived] = useState(false);
  const { screenToFlowPosition } = useReactFlow();

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

  const handleArchiveCompleted = () => {
    setNodes((nodes) =>
      nodes.map((node) =>
        node.data?.status === 'completed' && !node.data?.archived
          ? {
              ...node,
              data: {
                ...node.data,
                archived: true,
                archivedAt: new Date(),
              },
            }
          : node
      )
    );
  };

  const toggleShowArchived = () => {
    setShowArchived(!showArchived);
  };

  // Filter nodes based on archived visibility
  const visibleNodes = showArchived 
    ? nodes 
    : nodes.filter(node => !node.data?.archived);

  const onConnect: OnConnect = useCallback(
    (connection) => {
      setEdges((edges) => addEdge(connection, edges));
    },
    [setEdges],
  );

  const onConnectStart: OnConnectStart = useCallback(
    (_, { nodeId, handleType }) => {
      setConnectingNodeId(nodeId);
      setConnectingHandleType(handleType);
    },
    [],
  );

  const onConnectEnd: OnConnectEnd = useCallback(
    (event) => {
      if (connectingNodeId === null || connectingHandleType === null) return;
      const target = event.target as Element;
      if (!target.closest('.react-flow__node')) {
        // Only create new node if dropped on empty canvas and we have a connecting node
        const newId = getId();
        const { clientX, clientY } =
          'changedTouches' in event ? event.changedTouches[0] : event;

        const newNode: Node = {
          id: newId,
          type: 'task',
          position: screenToFlowPosition({ x: clientX, y: clientY }),
          data: { label: 'New Task', status: 'pending' },
        };

        const newEdge: Edge =
          connectingHandleType === 'source'
            ? {
                id: `e-${connectingNodeId}-${newId}`,
                source: connectingNodeId,
                target: newId,
              }
            : {
                id: `e-${newId}-${connectingNodeId}`,
                source: newId,
                target: connectingNodeId,
              };

        setNodes((nds) => nds.concat(newNode));
        setEdges((eds) => eds.concat(newEdge));
      }
      setConnectingNodeId(null);
      setConnectingHandleType(null);
    },
    [
      screenToFlowPosition,
      setNodes,
      setEdges,
      connectingNodeId,
      connectingHandleType,
    ],
  );

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <ReactFlow
        nodes={visibleNodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onConnectStart={onConnectStart}
        onConnectEnd={onConnectEnd}
        defaultEdgeOptions={{
          markerEnd: { type: MarkerType.ArrowClosed, width: 30, height: 30 },
        }}
        fitView={true}
      />
      <div className="absolute right-5 bottom-5 z-10 flex flex-col gap-2">
        <button
          onClick={toggleShowArchived}
          className={`rounded-md px-4 py-2 text-sm font-medium text-white shadow-lg transition-colors duration-200 ${
            showArchived
              ? 'bg-yellow-500 hover:bg-yellow-600'
              : 'bg-gray-500 hover:bg-gray-600'
          }`}
        >
          {showArchived ? 'Hide Archived' : 'Show Archived'}
        </button>
        <button
          onClick={handleArchiveCompleted}
          className="rounded-md bg-blue-500 px-4 py-2 text-sm font-medium text-white shadow-lg transition-colors duration-200 hover:bg-blue-600"
        >
          Archive Completed
        </button>
        <button
          onClick={handleClearStorage}
          className="rounded-md bg-red-500 px-4 py-2 text-sm font-medium text-white shadow-lg transition-colors duration-200 hover:bg-red-600"
        >
          Clear Storage
        </button>
      </div>
    </div>
  );
}

function App() {
  return (
    <ReactFlowProvider>
      <TaskGraphFlow />
    </ReactFlowProvider>
  );
}

export default App;
