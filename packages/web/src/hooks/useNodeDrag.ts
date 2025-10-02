import { useState } from 'react';
import { type OnNodeDrag } from '@xyflow/react';
import { useMutation } from '@tanstack/react-query';
import { useTRPC } from '../utils/trpc';
import type { NodeType } from '../components/flow/TaskGraphFlow';

const squaredDistance = (
  point1: { x: number; y: number },
  point2: { x: number; y: number },
) =>
  (point2.y - point1.y) * (point2.y - point1.y) +
  (point2.x - point1.x) * (point2.x - point1.x);

export function useNodeDrag(organizationId: string | undefined) {
  const trpc = useTRPC();
  const [nodeDragStartPos, setNodeDragStartPos] = useState({ x: 0, y: 0 });
  const dragNodes = useMutation(trpc.dragNodes.mutationOptions());

  const onNodeDragStart: OnNodeDrag<NodeType> = (event) => {
    setNodeDragStartPos({ x: event.clientX, y: event.clientY });
  };

  const onNodeDragStop: OnNodeDrag<NodeType> = (event, _, nodes) => {
    if (!organizationId) return;
    // Only update position if it was a significant drag (not just a click)
    const cursorPos = { x: event.clientX, y: event.clientY };
    const wasDraggedFar = squaredDistance(nodeDragStartPos, cursorPos) >= 200;

    if (!wasDraggedFar) return;

    dragNodes.mutate({
      organizationId,
      nodes: nodes.map(({ id, position }) => ({ nodeId: id, position })),
    });
  };

  return { onNodeDragStart, onNodeDragStop };
}
