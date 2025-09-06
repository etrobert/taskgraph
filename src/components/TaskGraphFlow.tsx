import ReactFlow, { MarkerType, type OnSelectionChangeParams } from 'reactflow';
import { useState, useCallback } from 'react';
import { TaskNode, type TaskNodeData } from './TaskNode';
import { ControlPanel } from './ControlPanel';
import { TaskPropertiesPanel } from './TaskPropertiesPanel';
import { useTaskConnection } from '../hooks/useTaskConnection';
import { useTaskStorage } from '../hooks/useTaskStorage';
import { useZoomShortcuts } from '../hooks/useZoomShortcuts';

const nodeTypes = {
  task: TaskNode,
};

export function TaskGraphFlow() {
  const [selection, setSelection] = useState<OnSelectionChangeParams>({
    nodes: [],
    edges: [],
  });

  const {
    showArchived,
    visibleNodes,
    handleClearStorage,
    toggleShowArchived,
    handleUpdateNode,
    nodes,
    edges,
    setNodes,
    setEdges,
    onNodesChange,
    onEdgesChange,
  } = useTaskStorage();

  const { onConnect, onConnectStart, onConnectEnd } = useTaskConnection(
    setNodes,
    setEdges,
  );

  const onSelectionChange = useCallback((params: OnSelectionChangeParams) => {
    setSelection(params);
  }, []);

  useZoomShortcuts();

  const handleNodeUpdate = useCallback(
    (nodeId: string, updates: Partial<TaskNodeData>) => {
      handleUpdateNode(nodeId, updates);

      // Update selection if the updated node is in the selection
      if (selection.nodes.some((node) => node.id === nodeId)) {
        setSelection((prev) => ({
          ...prev,
          nodes: prev.nodes.map((node) =>
            node.id === nodeId
              ? { ...node, data: { ...node.data, ...updates } }
              : node,
          ),
        }));
      }
    },
    [handleUpdateNode, selection],
  );

  return (
    <div style={{ width: '100vw', height: '100vh', display: 'flex' }}>
      <div style={{ flex: 1, height: '100vh' }}>
        <ReactFlow
          nodes={visibleNodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onConnectStart={onConnectStart}
          onConnectEnd={onConnectEnd}
          onSelectionChange={onSelectionChange}
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
      <TaskPropertiesPanel
        selection={selection}
        onUpdateNode={handleNodeUpdate}
      />
    </div>
  );
}
