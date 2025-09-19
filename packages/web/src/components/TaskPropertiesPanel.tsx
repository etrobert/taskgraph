import { type Node, type OnSelectionChangeParams } from 'reactflow';
import { type TaskNodeData } from './TaskNode';
import { useMutation } from '@tanstack/react-query';
import { trpc } from '../utils/trpc';
import type { SetStateAction } from 'react';

interface TaskPropertiesPanelProps {
  selection: OnSelectionChangeParams;
  setSelection: React.Dispatch<SetStateAction<OnSelectionChangeParams>>;
}

export function TaskPropertiesPanel({
  selection,
  setSelection,
}: TaskPropertiesPanelProps) {
  // Only show details if exactly one node is selected
  const selectedNode =
    selection.nodes.length === 1
      ? (selection.nodes[0] as Node<TaskNodeData>)
      : null;

  const updateTask = useMutation(
    trpc.updateTask.mutationOptions({
      onMutate: ({ id, updates }) => {
        const { name } = updates;
        // Update selection if the updated node is in the selection
        if (selection.nodes.some((node) => node.id === id)) {
          setSelection((prev) => ({
            ...prev,
            nodes: prev.nodes.map((node) =>
              node.id === id
                ? {
                    ...node,
                    data: { ...node.data, ...{ label: name } },
                  }
                : node,
            ),
          }));
        }
      },
    }),
  );

  if (!selectedNode) {
    return (
      <div className="h-full w-80 border-l border-gray-200 bg-gray-50 p-4">
        <h2 className="mb-4 text-lg font-semibold text-gray-700">
          Task Properties
        </h2>
        <p className="text-gray-500">
          {selection.nodes.length === 0
            ? 'Select a task to view its properties'
            : selection.nodes.length > 1
              ? `${selection.nodes.length} tasks selected`
              : 'Select a task to view its properties'}
        </p>
      </div>
    );
  }

  return (
    <div className="h-full w-80 border-l border-gray-200 bg-gray-50 p-4">
      <h2 className="mb-4 text-lg font-semibold text-gray-700">
        Task Properties
      </h2>

      {/* Task Name */}
      <div className="mb-4">
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Task Name
        </label>
        <input
          type="text"
          value={selectedNode.data.label}
          onChange={(e) =>
            updateTask.mutate({
              id: selectedNode.id,
              updates: { name: e.target.value },
            })
          }
          className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      </div>

      {/* Description */}
      <div className="mb-4">
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          value={selectedNode.data.description || ''}
          onChange={() =>
            // updateTask.mutate({id: selectedNode.id, updates: { description: e.target.value }})
            console.log('not implemented yet')
          }
          placeholder="Add a description for this task..."
          rows={5}
          className="w-full resize-none rounded-md border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      </div>

      {/* Status */}
      <div className="mb-4">
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Status
        </label>
        <select
          value={selectedNode.data.status || 'pending'}
          onChange={(e) =>
            updateTask.mutate({
              id: selectedNode.id,
              updates: { status: e.target.value as TaskNodeData['status'] },
            })
          }
          className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
        >
          <option value="pending">Pending</option>
          <option value="in progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
      </div>
    </div>
  );
}
