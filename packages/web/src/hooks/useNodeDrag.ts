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

export function useNodeDrag(nodes: NodeType[]) {
  const [nodeDragStartPos, setNodeDragStartPos] = useState({ x: 0, y: 0 });
  const { getIntersectingNodes } = useReactFlow<NodeType>();
  const updateTask = useMutation(trpc.updateTask.mutationOptions());
  const updateProject = useMutation(trpc.updateProject.mutationOptions());

  const handleTaskToProjectAssignment = (
    taskNode: NodeType,
    projectNode: NodeType,
  ) => {
    if (taskNode.parentId === projectNode.id) return false; // Already assigned

    updateTask.mutate({
      id: taskNode.id,
      updates: {
        projectId: projectNode.id,
        position: {
          x: taskNode.position.x - projectNode.position.x,
          y: taskNode.position.y - projectNode.position.y,
        },
      },
    });
    return true; // Assignment happened
  };

  const handleTaskFromProjectRemoval = (taskNode: NodeType) => {
    if (taskNode.parentId === undefined) return false; // Not in a project

    const parentProject = nodes.find(
      (n) => n.id === taskNode.parentId && n.type === 'project',
    );

    if (!parentProject) {
      console.error('Could not find parent project!');
      updateTask.mutate({ id: taskNode.id, updates: { projectId: null } });
      return true;
    }

    updateTask.mutate({
      id: taskNode.id,
      updates: {
        projectId: null,
        position: {
          x: taskNode.position.x + parentProject.position.x,
          y: taskNode.position.y + parentProject.position.y,
        },
      },
    });

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

  const handlePositionUpdate = ({ id, type, position }: NodeType) => {
    switch (type) {
      case 'task':
        updateTask.mutate({ id, updates: { position } });
        break;
      case 'project':
        updateProject.mutate({ id, updates: { position } });
        break;
    }
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
