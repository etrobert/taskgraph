import { useState } from 'react';
import { useReactFlow, type OnNodeDrag } from '@xyflow/react';
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
  const { getIntersectingNodes } = useReactFlow<NodeType>();
  const updateNode = useMutation(trpc.updateNode.mutationOptions());
  const addTaskToProject = useMutation(trpc.addTaskToProject.mutationOptions());
  const removeTaskFromProject = useMutation(
    trpc.removeTaskFromProject.mutationOptions(),
  );

  const handleTaskToProjectAssignment = (
    taskNode: NodeType,
    projectNode: NodeType,
  ) => {
    if (taskNode.parentId === projectNode.id) return false; // Already assigned

    addTaskToProject.mutate({ taskId: taskNode.id, projectId: projectNode.id });
    return true; // Assignment happened
  };

  const handleTaskFromProjectRemoval = (taskNode: NodeType) => {
    if (taskNode.parentId === undefined) return false; // Not in a project

    removeTaskFromProject.mutate({ taskId: taskNode.id });

    return true; // Removal happened
  };

  const handleProjectAssignmentChanges = (node: NodeType): boolean => {
    if (node.type !== 'task') return false;

    const intersectingNodes = getIntersectingNodes(node);
    const intersectingProjects = intersectingNodes.filter(
      (n) => n.type === 'project',
    );

    if (intersectingProjects.length === 1)
      return handleTaskToProjectAssignment(node, intersectingProjects[0]);
    else if (intersectingProjects.length === 0)
      return handleTaskFromProjectRemoval(node);

    return false;
  };

  const handlePositionUpdate = ({ id, position }: NodeType) => {
    updateNode.mutate({ id, updates: { position } });
  };

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
      // Handle project assignment changes first
      const assignmentChanged = handleProjectAssignmentChanges(draggedNode);
      // Skip position update if project assignment changed (position was updated there)
      if (assignmentChanged) continue;

      // Update position for nodes that weren't reassigned to projects
      handlePositionUpdate(draggedNode);
    }
  };

  return { onNodeDragStart, onNodeDragStop };
}
