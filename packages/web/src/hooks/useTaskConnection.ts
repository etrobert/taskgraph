import { useRef } from 'react';
import {
  useReactFlow,
  type OnConnectEnd,
  type OnConnectStart,
  type OnConnect,
} from '@xyflow/react';
import { useTRPC } from '../utils/trpc';
import { useMutation } from '@tanstack/react-query';

export function useTaskConnection(organizationId: string | undefined) {
  const trpc = useTRPC();
  const connectingNodeId = useRef<string>(null);
  const connectingHandleType = useRef<'source' | 'target'>(null);
  const { screenToFlowPosition, getIntersectingNodes } = useReactFlow();

  const createEdge = useMutation(trpc.createEdge.mutationOptions());

  const onConnect: OnConnect = (connection) => {
    if (organizationId === undefined) return;
    const { source, target } = connection;
    if (source === null || target === null) return;
    createEdge.mutate({ organizationId, source, target });
  };

  const onConnectStart: OnConnectStart = (_, { nodeId, handleType }) => {
    connectingNodeId.current = nodeId;
    connectingHandleType.current = handleType;
  };

  const createTaskFrom = useMutation(trpc.createTaskFrom.mutationOptions());

  const onConnectEnd: OnConnectEnd = (event) => {
    if (organizationId === undefined) return;
    if (
      connectingNodeId.current === null ||
      connectingHandleType.current === null
    )
      return;

    if (!(event instanceof MouseEvent)) throw new Error('event not supported');

    const { clientX, clientY } = event;
    const position = screenToFlowPosition({ x: clientX, y: clientY });

    // Check if dropping on a project node
    const intersectingNodes = getIntersectingNodes({
      x: position.x,
      y: position.y,
      width: 1,
      height: 1,
    });
    const projectNode = intersectingNodes.find(
      (node) => node.type === 'project',
    );

    // Create task if dropping on blank space OR on a project node
    const isDropOnPane =
      event.target instanceof HTMLElement &&
      event.target.classList.contains('react-flow__pane');
    const isDropOnProject = projectNode !== undefined;

    if (isDropOnPane || isDropOnProject) {
      createTaskFrom.mutate({
        organizationId,
        from: connectingNodeId.current,
        position,
        newTaskType:
          connectingHandleType.current === 'source' ? 'blocked' : 'blocking',
        projectId: projectNode?.id,
      });
    }

    connectingNodeId.current = null;
    connectingHandleType.current = null;
  };

  return {
    onConnect,
    onConnectStart,
    onConnectEnd,
  };
}
