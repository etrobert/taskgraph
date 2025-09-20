import { NodeResizer, type Node, type NodeProps } from '@xyflow/react';

export type ProjectNodeData = {};

export type ProjectNodeType = Node<ProjectNodeData, 'project'>;

export function ProjectNode({ selected }: NodeProps<ProjectNodeType>) {
  return (
    <div className="h-full rounded-lg border-2 border-blue-300 bg-blue-50 p-3">
      {selected && <NodeResizer />}
      <div className="text-lg font-medium text-blue-800">Project</div>
    </div>
  );
}

