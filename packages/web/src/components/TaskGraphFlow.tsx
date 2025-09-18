import ReactFlow, { MarkerType, type OnSelectionChangeParams } from 'reactflow';
import { useState, useCallback, useMemo } from 'react';
import { TaskNode, type TaskNodeData } from './TaskNode';
import { TaskPropertiesPanel } from './TaskPropertiesPanel';
import { useTaskConnection } from '../hooks/useTaskConnection';
import { useTaskStorage } from '../hooks/useTaskStorage';
import { useZoomShortcuts } from '../hooks/useZoomShortcuts';
import { useMutation, useQuery } from '@tanstack/react-query';
import { queryClient, trpc } from '../utils/trpc';

const nodeTypes = {
  task: TaskNode,
};

export function TaskGraphFlow() {
  const [selection, setSelection] = useState<OnSelectionChangeParams>({
    nodes: [],
    edges: [],
  });

  const { edges, setNodes, setEdges, onNodesChange, onEdgesChange } =
    useTaskStorage();

  const { data: tasks } = useQuery(trpc.tasks.queryOptions());

  const nodes = useMemo(
    () =>
      tasks === undefined
        ? []
        : tasks.map(({ id, name, position, status }) => ({
            id: id.toString(),
            position,
            type: 'task',
            data: { label: name, status },
          })),
    [tasks],
  );

  console.log(nodes);

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

  const { onConnect, onConnectStart, onConnectEnd } = useTaskConnection(
    setNodes,
    setEdges,
  );

  const onSelectionChange = useCallback((params: OnSelectionChangeParams) => {
    setSelection(params);
  }, []);

  useZoomShortcuts();

  const updateTask = useMutation(
    trpc.updateTask.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(trpc.tasks.queryFilter());
      },
    }),
  );

  const handleNodeUpdate = useCallback(
    (nodeId: string, updates: Partial<TaskNodeData>) => {
      handleUpdateNode(nodeId, updates);
      const name = updates.label;
      if (name !== undefined) {
        updateTask.mutate({ id: parseInt(nodeId), updates: { name } });
        console.log({ updates });
      }

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
    [handleUpdateNode, selection, updateTask],
  );

  return (
    <div style={{ width: '100vw', height: '100vh', display: 'flex' }}>
      <div style={{ flex: 1, height: '100vh' }}>
        <ReactFlow
          nodes={nodes}
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
      </div>
      <TaskPropertiesPanel
        selection={selection}
        onUpdateNode={handleNodeUpdate}
      />
    </div>
  );
}
