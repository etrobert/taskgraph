import { type Node, type NodeProps } from '@xyflow/react';
import { cn } from '@/lib/utils';

export type ProjectNodeData = {
  name: string;
};

export type ProjectNodeType = Node<ProjectNodeData, 'project'>;

export function ProjectNode({ data }: NodeProps<ProjectNodeType>) {
  return (
    <div
      className={cn(
        'min-w-[200px] rounded-lg border-2 border-blue-300 bg-blue-50 p-3',
      )}
    >
      <div className="text-lg font-medium text-blue-800">{data.name}</div>
    </div>
  );
}

