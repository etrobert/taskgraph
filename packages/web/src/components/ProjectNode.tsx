import { trpc } from '@/utils/trpc';
import { useMutation } from '@tanstack/react-query';
import { NodeResizer, Position, type Node, type NodeProps } from '@xyflow/react';
import { cn } from '@/lib/utils';
import {
  getStatusColor,
  getStatusIcon,
  cycleStatus,
} from '@/lib/statusHelpers';
import type { ProjectNodeData } from '@/lib/getProjectNodeFromProject';
import { FlowHandle } from './flow/FlowHandle';

export type ProjectNodeType = Node<ProjectNodeData, 'project'>;

export function ProjectNode({
  id,
  selected,
  data: { name, status, archivedAt },
}: NodeProps<ProjectNodeType>) {
  const resizeProject = useMutation(trpc.resizeProject.mutationOptions());
  const updateProjectDetails = useMutation(
    trpc.updateProjectDetails.mutationOptions(),
  );

  return (
    <div className="group relative h-full w-full">
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
      <FlowHandle type="target" position={Position.Left} />
      <div
        className={cn(
          'h-full rounded-lg border-2 p-3',
          getStatusColor(status),
          archivedAt && 'border-dashed bg-gray-50',
        )}
      >
        <div className="mb-2 flex items-center gap-2">
          <span
            className="cursor-pointer text-lg"
            onClick={() =>
              updateProjectDetails.mutate({
                id,
                updates: { status: cycleStatus(status) },
              })
            }
          >
            {getStatusIcon(status)}
          </span>
          <div className="text-lg font-medium">{name}</div>
          {archivedAt && '📁'}
        </div>
      </div>
      <FlowHandle type="source" position={Position.Right} />
    </div>
  );
}
