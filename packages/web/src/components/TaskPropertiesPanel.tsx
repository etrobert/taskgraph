import { type OnSelectionChangeParams } from 'reactflow';
import { type TaskNodeData } from './TaskNode';
import { useMutation, useQuery } from '@tanstack/react-query';
import { trpc, queryClient } from '../utils/trpc';
import { useEffect, useState } from 'react';

interface TaskPropertiesPanelProps {
  selection: OnSelectionChangeParams;
}

export function TaskPropertiesPanel({ selection }: TaskPropertiesPanelProps) {
  const { data: graph } = useQuery(trpc.graph.queryOptions());

  const [lastKeystroke, setLastKeystroke] = useState(0);
  const [name, setName] = useState('');

  useEffect(() => {
    if (graph === undefined) return;
    const selectedTask = graph.tasks.find(
      (task) => task.id === selection.nodes[0]?.id,
    );
    if (selectedTask === undefined) return;
    if (Date.now() - lastKeystroke < 1000) return;
    setName(selectedTask.name);
  }, [graph, lastKeystroke, name, selection.nodes]);

  const updateTask = useMutation(trpc.updateTask.mutationOptions());

  if (selection.nodes.length !== 1) {
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

  if (graph === undefined) return null;

  const selectedTask = graph.tasks.find(
    (task) => task.id === selection.nodes[0].id,
  );

  if (selectedTask === undefined) return null;

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
          value={name}
          onChange={(e) => {
            setLastKeystroke(Date.now());
            setName(e.target.value);
            updateTask.mutate({
              id: selectedTask.id,
              updates: { name: e.target.value },
            });
          }}
          className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      </div>

      {/* Description */}
      <div className="mb-4">
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          value={''}
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
          value={selectedTask.status || 'pending'}
          onChange={(e) =>
            updateTask.mutate({
              id: selectedTask.id,
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
