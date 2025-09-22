import { useRef } from 'react';
import {
  useReactFlow,
  type OnConnectEnd,
  type OnConnectStart,
  type OnConnect,
} from '@xyflow/react';
import { trpc } from '../utils/trpc';
import { useMutation } from '@tanstack/react-query';

export function useTaskConnection(organizationId: string | undefined) {
  const connectingNodeId = useRef<string>(null);
  const connectingHandleType = useRef<'source' | 'target'>(null);
  const { screenToFlowPosition } = useReactFlow();

  const createDependency = useMutation(trpc.createDependency.mutationOptions());

  const onConnect: OnConnect = (connection) => {
    if (organizationId === undefined) return;
    if (connection.source === null || connection.target === null) return;
    createDependency.mutate({
      organizationId,
      blockingTaskId: connection.source,
      blockedTaskId: connection.target,
    });
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
    if (
      event.target instanceof HTMLElement &&
      event.target.classList.contains('react-flow__pane')
    ) {
      const { clientX, clientY } =
        'changedTouches' in event ? event.changedTouches[0] : event;

      createTaskFrom.mutate({
        organizationId,
        from: connectingNodeId.current,
        position: screenToFlowPosition({ x: clientX, y: clientY }),
        newTaskType:
          connectingHandleType.current === 'source' ? 'blocked' : 'blocking',
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
