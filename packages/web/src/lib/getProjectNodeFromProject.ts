import type { Project } from '../../../api/src/db/schema';

export const getProjectNodeFromProject = (
  { id, position, width, height, ...data }: Project,
  selection: { id: string }[],
) =>
  ({
    id,
    type: 'project',
    position,
    width,
    height,
    hidden: data.archivedAt !== null,
    selected: selection.some((node) => node.id === id),
    data,
  }) as const;

export type ProjectNodeData = ReturnType<
  typeof getProjectNodeFromProject
>['data'];
