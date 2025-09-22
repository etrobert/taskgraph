import { trpc } from '@/utils/trpc';
import { useMutation } from '@tanstack/react-query';
import { NodeResizer, type Node, type NodeProps } from '@xyflow/react';
import { cn } from '@/lib/utils';
import {
  getStatusColor,
  getStatusIcon,
  cycleStatus,
  type Status,
} from '@/lib/statusHelpers';

export type ProjectNodeData = {
  name: string;
  status: Status;
};

export type ProjectNodeType = Node<ProjectNodeData, 'project'>;

export function ProjectNode({
  id,
  selected,
  data: { name, status },
}: NodeProps<ProjectNodeType>) {
  const resizeProject = useMutation(trpc.resizeProject.mutationOptions());
  const updateProject = useMutation(trpc.updateProject.mutationOptions());

  return (
    <div
      className={cn('h-full rounded-lg border-2 p-3', getStatusColor(status))}
    >
      {selected && (
        <NodeResizer
          onResizeEnd={(_event, params) =>
            resizeProject.mutate({
              id,
              position: { x: params.x, y: params.y },
              width: params.width,
              height: params.height,
            })
          }
        />
      )}
      <div className="mb-2 flex items-center gap-2">
        <span
          className="cursor-pointer text-lg"
          onClick={() =>
            updateProject.mutate({
              id,
              updates: { status: cycleStatus(status) },
            })
          }
        >
          {getStatusIcon(status)}
        </span>
        <div className="text-lg font-medium">{name}</div>
      </div>
    </div>
  );
}
