import ReactFlow, {
  type Node,
  useNodesState,
  useEdgesState,
  MarkerType,
  type OnSelectionChangeParams,
} from 'reactflow';
import { useState, useCallback } from 'react';
import { TaskNode, type TaskNodeData } from './TaskNode';
import { ControlPanel } from './ControlPanel';
import { TaskPropertiesPanel } from './TaskPropertiesPanel';
import { ArchivedTasksPanel } from './ArchivedTasksPanel';
import { useTaskConnection } from '../hooks/useTaskConnection';
import { useTaskStorage } from '../hooks/useTaskStorage';

const nodeTypes = {
  task: TaskNode,
};

export function TaskGraphFlow() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selection, setSelection] = useState<OnSelectionChangeParams>({
    nodes: [],
    edges: [],
  });
  const [selectedArchivedTask, setSelectedArchivedTask] =
    useState<Node<TaskNodeData> | null>(null);

  const { onConnect, onConnectStart, onConnectEnd } = useTaskConnection(
    setNodes,
    setEdges,
  );
  const {
    visibleNodes,
    handleClearStorage,
    handleUpdateNode,
    handleRestoreTask,
  } = useTaskStorage(nodes, edges, setNodes, setEdges);

  const onSelectionChange = useCallback((params: OnSelectionChangeParams) => {
    setSelectedArchivedTask(null);
    setSelection(params);
  }, []);

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

      // Update selectedArchivedTask if it's the one being updated
      if (selectedArchivedTask && selectedArchivedTask.id === nodeId) {
        const updatedNode = nodes.find((node) => node.id === nodeId);
        if (updatedNode) {
          setSelectedArchivedTask({
            ...updatedNode,
            data: { ...updatedNode.data, ...updates },
          });
        }
      }
    },
    [handleUpdateNode, selection, selectedArchivedTask, nodes],
  );

  const handleSelectArchivedTask = useCallback((task: Node<TaskNodeData>) => {
    setSelectedArchivedTask(task);
    // Clear board selection when selecting archived task
    setSelection({ nodes: [], edges: [] });
  }, []);

  const handleRestoreArchivedTask = useCallback(
    (taskId: string) => {
      handleRestoreTask(taskId);
      // Clear selected archived task if it was the one being restored
      if (selectedArchivedTask && selectedArchivedTask.id === taskId) {
        setSelectedArchivedTask(null);
      }
    },
    [handleRestoreTask, selectedArchivedTask],
  );

  // Get archived tasks
  const archivedTasks = nodes.filter((node) => node.data.archived);

  return (
    <div style={{ width: '100vw', height: '100vh', display: 'flex' }}>
      <ArchivedTasksPanel
        archivedTasks={archivedTasks}
        selectedArchivedTask={selectedArchivedTask}
        onSelectArchivedTask={handleSelectArchivedTask}
        onRestoreTask={handleRestoreArchivedTask}
      />
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
          onNodesChange={setNodes}
          onEdgesChange={setEdges}
          onClearStorage={handleClearStorage}
        />
      </div>
      <TaskPropertiesPanel
        selection={selection}
        selectedArchivedTask={selectedArchivedTask}
        onUpdateNode={handleNodeUpdate}
      />
    </div>
  );
}
