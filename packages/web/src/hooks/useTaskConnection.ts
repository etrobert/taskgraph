import { useState } from 'react';
import {
  useReactFlow,
  type OnConnectEnd,
  type OnConnectStart,
  type OnConnect,
} from '@xyflow/react';
import { trpc } from '../utils/trpc';
import { useMutation } from '@tanstack/react-query';

export function useTaskConnection(organizationId: string | undefined) {
  const [connectingNodeId, setConnectingNodeId] = useState<string | null>(null);
  const [connectingHandleType, setConnectingHandleType] = useState<
    'source' | 'target' | null
  >(null);
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
    setConnectingNodeId(nodeId);
    setConnectingHandleType(handleType);
  };

  const createTaskFrom = useMutation(trpc.createTaskFrom.mutationOptions());

  const onConnectEnd: OnConnectEnd = (event) => {
    if (organizationId === undefined) return;
    if (connectingNodeId === null || connectingHandleType === null) return;
    if (
      event.target instanceof HTMLElement &&
      event.target.classList.contains('react-flow__pane')
    ) {
      const { clientX, clientY } =
        'changedTouches' in event ? event.changedTouches[0] : event;

      createTaskFrom.mutate({
        organizationId,
        from: connectingNodeId,
        position: screenToFlowPosition({ x: clientX, y: clientY }),
        newTaskType: connectingHandleType === 'source' ? 'blocked' : 'blocking',
      });
    }
    setConnectingNodeId(null);
    setConnectingHandleType(null);
  };

  return {
    onConnect,
    onConnectStart,
    onConnectEnd,
  };
}
