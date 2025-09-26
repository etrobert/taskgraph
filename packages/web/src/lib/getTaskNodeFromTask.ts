import type { Node } from '@xyflow/react';
import type { ExtendedTask } from '../../../api/src/db/schema';

export const getTaskNodeFromTask = (
  { id, position, projectId, ...data }: ExtendedTask,
  selection: { id: string }[],
) =>
  ({
    id,
    position,
    parentId: projectId ?? undefined,
    type: 'task',
    hidden: data.archivedAt !== null,
    selected: selection.some((node) => node.id === id),
    data,
  }) as const satisfies Node;

export type TaskNodeData = ReturnType<typeof getTaskNodeFromTask>['data'];
