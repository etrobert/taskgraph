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
import { ControlPanel } from './components/ControlPanel';
import { defaultNodes, defaultEdges } from './defaults';
import { v4 as uuidv4 } from 'uuid';

const nodeTypes = {
  task: TaskNode,
};

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

  const toggleShowArchived = () => {
    setShowArchived(!showArchived);
  };

  // Filter nodes based on archived visibility
  const visibleNodes = showArchived
    ? nodes
    : nodes.filter((node) => !node.data?.archived);

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
        const newId = uuidv4();
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
        proOptions={{ hideAttribution: true }}
      />
      <ControlPanel
        nodes={nodes}
        edges={edges}
        showArchived={showArchived}
        onNodesChange={setNodes}
        onEdgesChange={setEdges}
        onToggleShowArchived={toggleShowArchived}
        onClearStorage={handleClearStorage}
      />
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
