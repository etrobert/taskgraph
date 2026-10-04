import { cn } from '@/lib/utils';
import { type Node, Position, type NodeProps } from '@xyflow/react';
import { type TaskNodeData } from '@/lib/getTaskNodeFromTask';
import { getStatusColor, getStatusIcon } from '@/lib/statusHelpers';
import { FlowHandle } from './flow/FlowHandle';

export type TaskNodeType = Node<TaskNodeData, 'task'>;

const second = 1000;
const minute = 60 * second;
const hour = 60 * minute;
const day = 24 * hour;

function getStaleIndicator(updatedAt: string) {
  const daysSinceUpdate = (Date.now() - Date.parse(updatedAt)) / day;

  if (daysSinceUpdate < 7) return null;

  return (
    <span title={`Last udpated ${Math.floor(daysSinceUpdate)} days ago`}>
      {daysSinceUpdate >= 14 ? '🐌' : '⏲️'}
    </span>
  );
}

export function TaskNode({ data, selected }: NodeProps<TaskNodeType>) {
  const staleIndicator = getStaleIndicator(data.updatedAt);

  return (
    <div className="group">
      <FlowHandle type="target" position={Position.Left} />
      <div
        className={cn(
          'rounded-lg border-2 px-4 py-2 shadow-md transition-all duration-200',
          getStatusColor(data.status),
          selected && 'border-blue-300 ring-2 ring-blue-300',
          data.archivedAt && 'border-dashed bg-gray-50',
        )}
      >
        <div className="flex items-center gap-2">
          <span className="cursor-pointer text-lg">
            {getStatusIcon(data.status)}
          </span>
          <span className="cursor-pointer truncate font-medium select-none">
            {data.name}
          </span>
          {data.status !== 'completed' && staleIndicator}
          {data.archivedAt && '📁'}
          {data.assignee && (
            <div
              className="bg-primary text-primary-foreground ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold"
              title={`Assigned to ${data.assignee.name}`}
            >
              {data.assignee.isAi
                ? '🤖'
                : data.assignee.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .toUpperCase()
                    .slice(0, 2)}
            </div>
          )}
        </div>
        {data.description && (
          <p className="text-muted-foreground mt-1 max-w-[180px] overflow-hidden text-xs text-ellipsis whitespace-nowrap">
            {data.description}
          </p>
        )}
        {data.url && (
          <a
            href={data.url}
            target="_blank"
            rel="noreferrer"
            className="mt-1 block max-w-[180px] truncate text-xs text-blue-600 hover:underline"
          >
            🔗 {data.url.replace(/^https?:\/\//, '')}
          </a>
        )}
      </div>
      <FlowHandle type="source" position={Position.Right} />
    </div>
  );
}
