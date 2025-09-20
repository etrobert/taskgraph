import { cn } from '@/lib/utils';
import { type Node, Handle, Position, type NodeProps } from '@xyflow/react';
import { type TaskNodeData } from '@/lib/getTaskNodeFromTask';

export type TaskNodeType = Node<TaskNodeData, 'task'>;

export function TaskNode({ data, selected }: NodeProps<TaskNodeType>) {
  const getStatusColor = () => {
    switch (data.status) {
      case 'completed':
        return 'bg-green-100 border-green-300 text-green-800';
      case 'in progress':
        return 'bg-blue-100 border-blue-300 text-blue-800';
      default:
        return 'bg-gray-100 border-gray-300 text-gray-800';
    }
  };

  const getStatusIcon = () => {
    switch (data.status) {
      case 'completed':
        return '✓';
      case 'in progress':
        return '⏳';
      default:
        return '○';
    }
  };

  return (
    <>
      <Handle type="target" position={Position.Left} />
      <div
        className={cn(
          'rounded-lg border-2 px-4 py-2 shadow-md transition-all duration-200',
          getStatusColor(),
          selected && 'border-purple-300 ring-2 ring-purple-400',
        )}
      >
        <div className="flex items-center gap-2">
          <span className="cursor-pointer text-lg transition-transform duration-150 hover:scale-110">
            {getStatusIcon()}
          </span>
          <span className="cursor-pointer font-medium select-none">
            {data.name}
          </span>
        </div>
      </div>
      <Handle type="source" position={Position.Right} />
    </>
  );
}
