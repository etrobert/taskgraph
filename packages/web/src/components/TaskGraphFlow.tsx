import {
  MarkerType,
  useEdgesState,
  useNodesState,
  type OnSelectionChangeParams,
  type OnNodesDelete,
  type OnNodeDrag,
  type Edge,
  ReactFlow,
} from '@xyflow/react';
import { useState, useCallback, useEffect, useRef } from 'react';
import { getTaskNodeFromTask, TaskNode } from './TaskNode';
import { TaskPropertiesPanel } from './TaskPropertiesPanel';
import { useTaskConnection } from '../hooks/useTaskConnection';
import { useZoomShortcuts } from '../hooks/useZoomShortcuts';
import { useMutation, useQuery } from '@tanstack/react-query';
import { queryClient, trpc } from '../utils/trpc';
import { useSubscription } from '@trpc/tanstack-react-query';
import { useOrganizationId } from '../hooks/useOrganizationId';

const nodeTypes = {
  task: TaskNode,
};

const squaredDistance = (
  point1: { x: number; y: number },
  point2: { x: number; y: number },
) =>
  (point2.y - point1.y) * (point2.y - point1.y) +
  (point2.x - point1.x) * (point2.x - point1.x);

export function TaskGraphFlow() {
  const [selection, setSelection] = useState<{
    nodes: TaskNode[];
    edges: Edge[];
  }>({
    nodes: [],
    edges: [],
  });

  const [nodes, setNodes, onNodesChange] = useNodesState<TaskNode>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  const organizationId = useOrganizationId();

  const { data: graph } = useQuery(
    trpc.graph.queryOptions(
      { organizationId: organizationId! },
      { enabled: !!organizationId },
    ),
  );

  const previousGraph = useRef<typeof graph>(undefined);
  useEffect(() => {
    if (graph === undefined) return;
    if (previousGraph.current === graph) return;
    previousGraph.current = graph;
    const { tasks, dependencies } = graph;
    setNodes(tasks.map((task) => getTaskNodeFromTask(task, selection.nodes)));
    setEdges(
      dependencies.map((dependency) => ({
        id: dependency.id,
        source: dependency.blockingTaskId,
        target: dependency.blockedTaskId,
      })),
    );
  }, [selection.nodes, setNodes, graph, setEdges]);

  const { onConnect, onConnectStart, onConnectEnd } =
    useTaskConnection(organizationId);

  const onSelectionChange = useCallback(
    (params: OnSelectionChangeParams<TaskNode>) => {
      setSelection(params);
    },
    [],
  );

  useZoomShortcuts();

  const updateTask = useMutation(trpc.updateTask.mutationOptions());

  useSubscription(
    trpc.onTasksChange.subscriptionOptions(undefined, {
      onData: () => queryClient.invalidateQueries(trpc.graph.queryFilter()),
    }),
  );

  const [nodeDragStartPos, setNodeDragStartPos] = useState({ x: 0, y: 0 });

  const onNodeDragStart = useCallback<OnNodeDrag<TaskNode>>((event) => {
    setNodeDragStartPos({ x: event.clientX, y: event.clientY });
  }, []);

  const onNodeDragStop = useCallback<OnNodeDrag<TaskNode>>(
    (event, node) => {
      const cursorPos = { x: event.clientX, y: event.clientY };
      if (squaredDistance(nodeDragStartPos, cursorPos) < 200) return;
      updateTask.mutate({ id: node.id, updates: { position: node.position } });
    },
    [nodeDragStartPos, updateTask],
  );

  const deleteTasks = useMutation(trpc.deleteTasks.mutationOptions());

  const onNodesDelete = useCallback<OnNodesDelete>(
    (nodes) => deleteTasks.mutate(nodes.map((node) => node.id)),
    [deleteTasks],
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
          onNodeDragStop={onNodeDragStop}
          onNodeDragStart={onNodeDragStart}
          onNodesDelete={onNodesDelete}
          defaultEdgeOptions={{
            markerEnd: { type: MarkerType.ArrowClosed, width: 30, height: 30 },
          }}
          fitView={true}
          proOptions={{ hideAttribution: true }}
        />
      </div>
      <TaskPropertiesPanel selection={selection} />
    </div>
  );
}
