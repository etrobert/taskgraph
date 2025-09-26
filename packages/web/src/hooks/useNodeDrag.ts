import { useState } from 'react';
import { type OnNodeDrag } from '@xyflow/react';
import { useMutation } from '@tanstack/react-query';
import { trpc } from '../utils/trpc';
import type { NodeType } from '../components/flow/TaskGraphFlow';

const squaredDistance = (
  point1: { x: number; y: number },
  point2: { x: number; y: number },
) =>
  (point2.y - point1.y) * (point2.y - point1.y) +
  (point2.x - point1.x) * (point2.x - point1.x);

export function useNodeDrag() {
  const [nodeDragStartPos, setNodeDragStartPos] = useState({ x: 0, y: 0 });
  const dragNode = useMutation(trpc.dragNode.mutationOptions());

  const onNodeDragStart: OnNodeDrag<NodeType> = (event) => {
    setNodeDragStartPos({ x: event.clientX, y: event.clientY });
  };

  const onNodeDragStop: OnNodeDrag<NodeType> = (event, _, nodes) => {
    // Only update position if it was a significant drag (not just a click)
    const cursorPos = { x: event.clientX, y: event.clientY };
    const wasDraggedFar = squaredDistance(nodeDragStartPos, cursorPos) >= 200;

    if (!wasDraggedFar) return;

    // Handle all dragged nodes (for group drag support)
    for (const draggedNode of nodes) {
      dragNode.mutate({
        organizationId: draggedNode.data.organizationId,
        nodeId: draggedNode.id,
        position: draggedNode.position,
      });
    }
  };

  return { onNodeDragStart, onNodeDragStop };
}
