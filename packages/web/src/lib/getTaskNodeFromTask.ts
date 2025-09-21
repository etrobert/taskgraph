import type { Task } from '../../../api/src/db/schema';

export const getTaskNodeFromTask = (
  { id, position, projectId, ...data }: Task,
  selection: { id: string }[],
) =>
  ({
    id,
    position,
    parentId: projectId,
    type: 'task',
    selected: selection.some((node) => node.id === id),
    data,
  }) as const;

export type TaskNodeData = ReturnType<typeof getTaskNodeFromTask>['data'];
