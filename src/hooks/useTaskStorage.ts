import { useEffect, useState, useCallback } from 'react';
import { useNodesState, useEdgesState } from 'reactflow';
import { saveToStorage, loadFromStorage, clearStorage } from '../storage';
import { defaultNodes, defaultEdges } from '../defaults';

export function useTaskStorage() {
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

  const handleClearStorage = useCallback(() => {
    clearStorage();
    setNodes(defaultNodes);
    setEdges(defaultEdges);
  }, [setNodes, setEdges]);

  return {
    nodes,
    edges,
    setNodes,
    setEdges,
    onNodesChange,
    onEdgesChange,
    isLoaded,
    handleClearStorage,
  };
}
