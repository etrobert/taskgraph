import { Handle, Position, type NodeProps, useReactFlow } from 'reactflow';
import { useState, useCallback } from 'react';

export interface TaskNodeData {
  label: string;
  status?: 'pending' | 'in-progress' | 'completed';
}

export function TaskNode({ data, id }: NodeProps<TaskNodeData>) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(data.label);
  const { setNodes } = useReactFlow();

  const updateNodeLabel = useCallback(() => {
    if (editValue.trim() && editValue !== data.label) {
      setNodes((nodes) =>
        nodes.map((node) =>
          node.id === id
            ? { ...node, data: { ...node.data, label: editValue.trim() } }
            : node,
        ),
      );
    }
  }, [editValue, data.label, id, setNodes]);

  const handleDoubleClick = useCallback(() => {
    setIsEditing(true);
    setEditValue(data.label);
  }, [data.label]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        updateNodeLabel();
        setIsEditing(false);
      } else if (e.key === 'Escape') {
        setIsEditing(false);
        setEditValue(data.label);
      }
    },
    [updateNodeLabel, data.label],
  );

  const handleBlur = useCallback(() => {
    updateNodeLabel();
    setIsEditing(false);
  }, [updateNodeLabel]);

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
      <Handle type="target" position={Position.Left} />
      <div
        className={`rounded-lg border-2 px-4 py-2 shadow-md transition-all duration-200 ${getStatusColor()} ${
          isEditing ? 'border-blue-300 ring-2 ring-blue-400' : ''
        }`}
        onDoubleClick={handleDoubleClick}
        title="Double-click to edit"
      >
        <div className="flex items-center gap-2">
          <span className="text-lg">{getStatusIcon()}</span>
          {isEditing ? (
            <input
              type="text"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={handleBlur}
              className="min-w-0 flex-1 border-none bg-transparent font-medium text-inherit outline-none"
              autoFocus
            />
          ) : (
            <span className="cursor-pointer font-medium select-none">
              {data.label}
            </span>
          )}
        </div>
      </div>
      <Handle type="source" position={Position.Right} />
    </>
  );
}
