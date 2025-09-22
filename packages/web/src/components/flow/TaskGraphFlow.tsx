import {
  MarkerType,
  useEdgesState,
  useNodesState,
  type OnNodesDelete,
  type OnEdgesDelete,
  type Edge,
  ReactFlow,
  useReactFlow,
  useViewport,
  type OnSelectionChangeFunc,
} from '@xyflow/react';
import { useState, useMemo } from 'react';
import { TaskNode, type TaskNodeType } from '../TaskNode';
import { ProjectNode, type ProjectNodeType } from '../ProjectNode';
import { PropertiesPanel } from '../PropertiesPanel';
import { useTaskConnection } from '../../hooks/useTaskConnection';
import { useZoomShortcuts } from '../../hooks/useZoomShortcuts';
import { queryClient, trpc } from '../../utils/trpc';
import { useSubscription } from '@trpc/tanstack-react-query';
import { useOrganizationId } from '../../hooks/useOrganizationId';
import { Button } from '../ui/button';
import { useMoving } from './useMoving';
import { useGraphSync } from './useGraphSync';
import { useNodeDrag } from '../../hooks/useNodeDrag';
import { useMutation } from '@tanstack/react-query';
import { applyDagreLayout } from '../../lib/dagreLayout';

const nodeTypes = {
  task: TaskNode,
  project: ProjectNode,
};

export type NodeType = TaskNodeType | ProjectNodeType;

function useScreenNodesBounds(nodes: NodeType[]) {
  const { getNodesBounds, flowToScreenPosition } = useReactFlow<NodeType>();

  const viewport = useViewport();

  return useMemo(() => {
    const { width, height, ...flowPos } = getNodesBounds(nodes);
    const pos = flowToScreenPosition(flowPos);
    const { zoom } = viewport;
    const size = { width: width * zoom, height: height * zoom };
    return { ...pos, ...size };
  }, [flowToScreenPosition, getNodesBounds, nodes, viewport]);
}

export function TaskGraphFlow() {
  const [selection, setSelection] = useState<{
    nodes: NodeType[];
    edges: Edge[];
  }>({
    nodes: [],
    edges: [],
  });

  const { getNodesBounds } = useReactFlow<NodeType>();

  const [isComputedView, setIsComputedView] = useState(false);
  const [rawNodes, setRawNodes, onNodesChange] = useNodesState<NodeType>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  const organizationId = useOrganizationId();

  // Compute display nodes based on view mode
  const nodes = isComputedView
    ? applyDagreLayout(rawNodes, edges, getNodesBounds)
    : rawNodes;

  useGraphSync(organizationId, selection, setRawNodes, setEdges);

  const { onConnect, onConnectStart, onConnectEnd } =
    useTaskConnection(organizationId);

  const onSelectionChange: OnSelectionChangeFunc<NodeType> = (params) =>
    setSelection(params);

  useZoomShortcuts();

  useSubscription(
    trpc.onTasksChange.subscriptionOptions(undefined, {
      onData: () => queryClient.invalidateQueries(trpc.graph.queryFilter()),
    }),
  );

  const { onMove, moving } = useMoving();

  const selectionScreenBounds = useScreenNodesBounds(selection.nodes);

  const { onNodeDragStart, onNodeDragStop } = useNodeDrag(nodes);

  const deleteTasks = useMutation(trpc.deleteTasks.mutationOptions());
  const deleteProjects = useMutation(trpc.deleteProjects.mutationOptions());
  const deleteDependencies = useMutation(
    trpc.deleteDependencies.mutationOptions(),
  );

  const onNodesDelete: OnNodesDelete = (nodes) => {
    const taskNodes = nodes.filter((node) => node.type === 'task');
    const projectNodes = nodes.filter((node) => node.type === 'project');

    if (taskNodes.length > 0) {
      deleteTasks.mutate(taskNodes.map((node) => node.id));
    }
    if (projectNodes.length > 0) {
      deleteProjects.mutate(projectNodes.map((node) => node.id));
    }
  };

  const onEdgesDelete: OnEdgesDelete = (edges) => {
    if (edges.length > 0)
      deleteDependencies.mutate(edges.map((edge) => edge.id));
  };

  const toggleComputedView = () =>
    setIsComputedView((isComputedView) => !isComputedView);

  const groupTasksMutation = useMutation(trpc.groupTasks.mutationOptions());

  const handleGroupTasks = () => {
    const taskNodes = selection.nodes.filter((node) => node.type === 'task');
    if (taskNodes.length < 2 || !organizationId) return;

    // Calculate accurate bounding box using React Flow's method
    const bounds = getNodesBounds(taskNodes);
    const padding = 20;

    groupTasksMutation.mutate({
      taskIds: taskNodes.map((node) => node.id),
      organizationId,
      projectBounds: {
        x: bounds.x - padding,
        y: bounds.y - padding,
        width: bounds.width + 2 * padding,
        height: bounds.height + 2 * padding,
      },
    });
  };

  return (
    <div style={{ width: '100vw', height: '100vh', display: 'flex' }}>
      <div style={{ flex: 1, height: '100vh' }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onMove={onMove}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onConnectStart={onConnectStart}
          onConnectEnd={onConnectEnd}
          onSelectionChange={onSelectionChange}
          onNodeDragStop={onNodeDragStop}
          onNodeDragStart={onNodeDragStart}
          onNodesDelete={onNodesDelete}
          onEdgesDelete={onEdgesDelete}
          multiSelectionKeyCode="Shift"
          defaultEdgeOptions={{
            markerEnd: { type: MarkerType.ArrowClosed, width: 30, height: 30 },
          }}
          fitView={true}
          proOptions={{ hideAttribution: true }}
        />
        <Button
          className="absolute bottom-4 left-4 z-10"
          variant={isComputedView ? 'default' : 'outline'}
          onClick={toggleComputedView}
        >
          {isComputedView ? 'Spatial View' : 'Computed View'}
        </Button>
        {!moving &&
          selection.nodes.filter((node) => node.type === 'task').length > 1 && (
            <Button
              className="absolute -translate-x-1/2 -translate-y-[calc(100%+8px)]"
              style={{
                left: selectionScreenBounds.x + selectionScreenBounds.width / 2,
                top: selectionScreenBounds.y,
              }}
              onClick={handleGroupTasks}
            >
              Group
            </Button>
          )}
      </div>
      <PropertiesPanel selection={selection} />
    </div>
  );
}
