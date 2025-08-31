import { useEffect, useState, useCallback } from 'react';
import { type Node, type Edge } from 'reactflow';
import { saveToStorage, loadFromStorage, clearStorage } from '../storage';
import { defaultNodes, defaultEdges } from '../defaults';
import { type TaskNodeData } from '../components/TaskNode';

export function useTaskStorage(
  nodes: Node[],
  edges: Edge[],
  setNodes: (nodes: Node[] | ((nodes: Node[]) => Node[])) => void,
  setEdges: (edges: Edge[] | ((edges: Edge[]) => Edge[])) => void,
) {
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

  const handleClearStorage = useCallback(() => {
    clearStorage();
    setNodes(defaultNodes);
    setEdges(defaultEdges);
  }, [setNodes, setEdges]);

  const handleRestoreTask = useCallback(
    (taskId: string) => {
      setNodes((nds) =>
        nds.map((node) =>
          node.id === taskId
            ? {
                ...node,
                data: {
                  ...node.data,
                  archived: false,
                  archivedAt: undefined,
                },
              }
            : node,
        ),
      );
    },
    [setNodes],
  );

  const handleUpdateNode = useCallback(
    (nodeId: string, updates: Partial<TaskNodeData>) => {
      setNodes((nds) =>
        nds.map((node) =>
          node.id === nodeId
            ? { ...node, data: { ...node.data, ...updates } }
            : node,
        ),
      );
    },
    [setNodes],
  );

  // Always filter out archived tasks from the board
  const visibleNodes = nodes.filter((node) => !node.data?.archived);

  return {
    isLoaded,
    visibleNodes,
    handleClearStorage,
    handleUpdateNode,
    handleRestoreTask,
  };
}
