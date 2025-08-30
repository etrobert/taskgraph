import { Handle, Position, type NodeProps } from 'reactflow';

export interface TaskNodeData {
  label: string;
  status?: 'pending' | 'in-progress' | 'completed';
}

export function TaskNode({ data }: NodeProps<TaskNodeData>) {
  const getStatusColor = () => {
    switch (data.status) {
      case 'completed':
        return 'bg-green-100 border-green-300 text-green-800';
      case 'in-progress':
        return 'bg-blue-100 border-blue-300 text-blue-800';
      default:
        return 'bg-gray-100 border-gray-300 text-gray-800';
    }
  };

  const getStatusIcon = () => {
    switch (data.status) {
      case 'completed':
        return '✓';
      case 'in-progress':
        return '⏳';
      default:
        return '○';
    }
  };

  return (
    <>
      <Handle type="target" position={Position.Right} />
      <div className={`rounded-lg border-2 px-4 py-2 shadow-md ${getStatusColor()}`}>
        <div className="flex items-center gap-2">
          <span className="text-lg">{getStatusIcon()}</span>
          <span className="font-medium">{data.label}</span>
        </div>
      </div>
      <Handle type="source" position={Position.Left} />
    </>
  );
}