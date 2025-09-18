import { useCallback, useState } from 'react';
import {
  type Node,
  type Edge,
  useReactFlow,
  type OnConnectEnd,
  type OnConnectStart,
  type OnConnect,
  addEdge,
} from 'reactflow';
import { v4 as uuidv4 } from 'uuid';

export function useTaskConnection(
  setNodes: (nodes: Node[] | ((nodes: Node[]) => Node[])) => void,
  setEdges: (edges: Edge[] | ((edges: Edge[]) => Edge[])) => void,
) {
  const [connectingNodeId, setConnectingNodeId] = useState<string | null>(null);
  const [connectingHandleType, setConnectingHandleType] = useState<
    'source' | 'target' | null
  >(null);
  const { screenToFlowPosition } = useReactFlow();

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
      if (
        event.target instanceof HTMLElement &&
        event.target.classList.contains('react-flow__pane')
      ) {
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

  return {
    onConnect,
    onConnectStart,
    onConnectEnd,
  };
}
