import { useCallback, useState } from 'react';
import {
  useReactFlow,
  type OnConnectEnd,
  type OnConnectStart,
  type OnConnect,
} from 'reactflow';
import { trpc } from '../utils/trpc';
import { useMutation } from '@tanstack/react-query';

export function useTaskConnection() {
  const [connectingNodeId, setConnectingNodeId] = useState<string | null>(null);
  const [connectingHandleType, setConnectingHandleType] = useState<
    'source' | 'target' | null
  >(null);
  const { screenToFlowPosition } = useReactFlow();

  const createDependency = useMutation(trpc.createDependency.mutationOptions());

  const onConnect: OnConnect = useCallback(
    (connection) => {
      if (connection.source === null || connection.target === null) return;
      createDependency.mutate({
        blockingTaskId: connection.source,
        blockedTaskId: connection.target,
      });
    },
    [createDependency],
  );

  const onConnectStart: OnConnectStart = useCallback(
    (_, { nodeId, handleType }) => {
      setConnectingNodeId(nodeId);
      setConnectingHandleType(handleType);
    },
    [],
  );

  const createTaskFrom = useMutation(trpc.createTaskFrom.mutationOptions());

  const onConnectEnd: OnConnectEnd = useCallback(
    (event) => {
      if (connectingNodeId === null || connectingHandleType === null) return;
      if (
        event.target instanceof HTMLElement &&
        event.target.classList.contains('react-flow__pane')
      ) {
        const { clientX, clientY } =
          'changedTouches' in event ? event.changedTouches[0] : event;

        createTaskFrom.mutate({
          from: connectingNodeId,
          position: screenToFlowPosition({ x: clientX, y: clientY }),
        });
      }
      setConnectingNodeId(null);
      setConnectingHandleType(null);
    },
    [
      connectingNodeId,
      connectingHandleType,
      createTaskFrom,
      screenToFlowPosition,
    ],
  );

  return {
    onConnect,
    onConnectStart,
    onConnectEnd,
  };
}
