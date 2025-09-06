import { useEffect, useState, useCallback } from 'react';
import { useNodesState, useEdgesState } from 'reactflow';
import { saveToStorage, loadFromStorage, clearStorage } from '../storage';
import { defaultNodes, defaultEdges } from '../defaults';
import { type TaskNodeData } from '../components/TaskNode';

export function useTaskStorage() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const [isLoaded, setIsLoaded] = useState(false);
  const [showArchived, setShowArchived] = useState(false);

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

  const toggleShowArchived = useCallback(() => {
    setShowArchived((showArchived) => !showArchived);
  }, []);

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

  // Filter nodes based on archived visibility
  const visibleNodes = showArchived
    ? nodes
    : nodes.filter((node) => !node.data?.archived);

  return {
    nodes,
    edges,
    setNodes,
    setEdges,
    onNodesChange,
    onEdgesChange,
    isLoaded,
    showArchived,
    visibleNodes,
    handleClearStorage,
    toggleShowArchived,
    handleUpdateNode,
  };
}
