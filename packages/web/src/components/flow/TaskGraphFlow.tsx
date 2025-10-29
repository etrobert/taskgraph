import {
  MarkerType,
  useEdgesState,
  useNodesState,
  type Edge,
  ReactFlow,
  useReactFlow,
  type OnSelectionChangeFunc,
  Background,
  useKeyPress,
} from '@xyflow/react';
import { useState } from 'react';
import { TaskNode, type TaskNodeType } from '../TaskNode';
import { ProjectNode, type ProjectNodeType } from '../ProjectNode';
import { PropertiesPanel } from '../PropertiesPanel';
import { useTaskConnection } from '../../hooks/useTaskConnection';
import { useZoomShortcuts } from '../../hooks/useZoomShortcuts';
import { useTRPC } from '../../utils/trpc';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { useSubscription } from '@trpc/tanstack-react-query';
import { useOrganizationId } from '../../hooks/useOrganizationId';
import { Button } from '../ui/button';
import { useMoving } from './useMoving';
import { useGraphSync } from './useGraphSync';
import { useNodeDrag } from '../../hooks/useNodeDrag';
import { useOnDelete } from '../../hooks/useOnDelete';
import { applyDagreLayout } from '../../lib/dagreLayout';
import { Toolbar } from './Toolbar';
import { usePageTitle } from '../../hooks/usePageTitle';
import { useScreenNodesBounds } from '../../hooks/useScreenNodesBounds';

const nodeTypes = {
  task: TaskNode,
  project: ProjectNode,
};

export type NodeType = TaskNodeType | ProjectNodeType;

export function TaskGraphFlow() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const [selection, setSelection] = useState<{
    nodes: NodeType[];
    edges: Edge[];
  }>({
    nodes: [],
    edges: [],
  });

  const [isComputedView, setIsComputedView] = useState(false);
  const [showArchived, setShowArchived] = useState(false);
  const [rawNodes, setRawNodes, onNodesChange] = useNodesState<NodeType>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  const organizationId = useOrganizationId();
  usePageTitle();

  // Compute display nodes based on view mode
  const nodes = isComputedView
    ? applyDagreLayout(rawNodes, edges, showArchived)
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

  const { onNodeDragStart, onNodeDragStop } = useNodeDrag(organizationId);
  const { onNodesDelete, onEdgesDelete } = useOnDelete();

  const { fitView } = useReactFlow<NodeType>();

  const toggleComputedView = () => {
    setIsComputedView((isComputedView) => !isComputedView);
    // Fit view after state change to show the new layout
    setTimeout(() => fitView(), 0);
  };

  const toggleShowArchived = () => {
    setShowArchived((showArchived) => !showArchived);
    // Fit view after state change to show the new layout
    setTimeout(fitView, 0);
  };

  const groupTasksMutation = useMutation(trpc.groupTasks.mutationOptions());
  const { getNodesBounds } = useReactFlow<NodeType>();

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

  const spacePressed = useKeyPress('Space');

  console.log(spacePressed);

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
          minZoom={0.1}
          nodesDraggable={!isComputedView && !spacePressed}
          defaultEdgeOptions={{
            markerEnd: { type: MarkerType.ArrowClosed, width: 30, height: 30 },
          }}
          fitView={true}
          proOptions={{ hideAttribution: true }}
          panOnScroll
        >
          {isComputedView && (
            <>
              <Background
                // @ts-expect-error idk what's going on here
                variant="dots"
                gap={20}
                size={2}
                color="#3b82f6"
              />
              <div className="pointer-events-none absolute inset-0 animate-pulse border-4 border-dashed border-blue-500 opacity-80" />
            </>
          )}
        </ReactFlow>
        <Toolbar
          isComputedView={isComputedView}
          onToggleComputedView={toggleComputedView}
          organizationId={organizationId}
          nodes={nodes}
          showArchived={showArchived}
          onToggleShowArchived={toggleShowArchived}
        />
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
