import type { Node } from '@xyflow/react';
import type { Task } from '../../../api/src/db/schema';

export const getTaskNodeFromTask = (
  { id, position, projectId, archivedAt, ...data }: Task,
  selection: { id: string }[],
) =>
  ({
    id,
    position,
    parentId: projectId ?? undefined,
    type: 'task',
    hidden: archivedAt !== null,
    selected: selection.some((node) => node.id === id),
    data,
  }) as const satisfies Node;

export type TaskNodeData = ReturnType<typeof getTaskNodeFromTask>['data'];
