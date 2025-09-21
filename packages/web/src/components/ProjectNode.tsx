import { trpc } from '@/utils/trpc';
import { useMutation } from '@tanstack/react-query';
import { NodeResizer, type Node, type NodeProps } from '@xyflow/react';

export type ProjectNodeData = {};

export type ProjectNodeType = Node<ProjectNodeData, 'project'>;

export function ProjectNode({ id, selected }: NodeProps<ProjectNodeType>) {
  const updateProject = useMutation(trpc.updateProject.mutationOptions());
  return (
    <div className="h-full rounded-lg border-2 border-blue-300 bg-blue-50 p-3">
      {selected && (
        <NodeResizer
          onResizeEnd={(_event, params) =>
            updateProject.mutate({
              id,
              updates: {
                width: params.width,
                height: params.height,
                position: { x: params.x, y: params.y },
              },
            })
          }
        />
      )}
      <div className="text-lg font-medium text-blue-800">Project</div>
    </div>
  );
}
