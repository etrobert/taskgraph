import ReactFlow, {
  MarkerType,
  useEdgesState,
  useNodesState,
  type OnSelectionChangeParams,
} from 'reactflow';
import { useState, useCallback, useEffect } from 'react';
import { TaskNode, type TaskNodeData } from './TaskNode';
import { TaskPropertiesPanel } from './TaskPropertiesPanel';
import { useTaskConnection } from '../hooks/useTaskConnection';
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

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const { data: tasks } = useQuery(trpc.tasks.queryOptions());

  useEffect(() => {
    setNodes(
      tasks === undefined
        ? []
        : tasks.map(({ id, name, position, status }) => ({
            id: id.toString(),
            position,
            type: 'task',
            selected: selection.nodes.some((node) => node.id === id.toString()),
            data: { label: name, status },
          })),
    );
  }, [selection.nodes, setNodes, tasks]);

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
      const name = updates.label;
      if (name !== undefined)
        updateTask.mutate({ id: parseInt(nodeId), updates: { name } });

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
    [selection, updateTask],
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
