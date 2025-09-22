import { cn } from '@/lib/utils';
import { type Node, Handle, Position, type NodeProps } from '@xyflow/react';
import { type TaskNodeData } from '@/lib/getTaskNodeFromTask';
import { getStatusColor, getStatusIcon } from '@/lib/statusHelpers';

export type TaskNodeType = Node<TaskNodeData, 'task'>;

export function TaskNode({ data, selected }: NodeProps<TaskNodeType>) {
  return (
    <div className="group">
      <Handle
        type="target"
        position={Position.Left}
        style={{
          width: '16px',
          height: '16px',
          background: '#fff',
          border: '2px solid #9ca3af',
          transition: 'opacity 0.1s',
        }}
        className="opacity-0 group-hover:opacity-100"
      />
      <div
        className={cn(
          'rounded-lg border-2 px-4 py-2 shadow-md transition-all duration-200',
          getStatusColor(data.status),
          selected && 'border-purple-300 ring-2 ring-purple-400',
          data.archivedAt && 'border-dashed bg-gray-50',
        )}
      >
        <div className="flex items-center gap-2">
          <span className="cursor-pointer text-lg">
            {getStatusIcon(data.status)}
          </span>
          <span className="cursor-pointer font-medium select-none">
            {data.name}
          </span>
          {data.archivedAt && '📁'}
        </div>
      </div>
      <Handle
        type="source"
        position={Position.Right}
        style={{
          width: '16px',
          height: '16px',
          background: '#fff',
          border: '2px solid #9ca3af',
          transition: 'opacity 0.1s',
        }}
        className="opacity-0 group-hover:opacity-100"
      />
    </div>
  );
}
