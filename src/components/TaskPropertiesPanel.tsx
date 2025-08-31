import { type Node, type OnSelectionChangeParams } from 'reactflow';
import { type TaskNodeData } from './TaskNode';

interface TaskPropertiesPanelProps {
  selection: OnSelectionChangeParams;
  selectedArchivedTask: Node<TaskNodeData> | null;
  onUpdateNode: (nodeId: string, updates: Partial<TaskNodeData>) => void;
}

export function TaskPropertiesPanel({
  selection,
  selectedArchivedTask,
  onUpdateNode,
}: TaskPropertiesPanelProps) {
  // Determine which task to show - archived task takes priority, then board selection
  const selectedTask =
    selectedArchivedTask ||
    (selection.nodes.length === 1
      ? (selection.nodes[0] as Node<TaskNodeData>)
      : null);

  const handleNameChange = (newName: string) => {
    if (selectedTask) {
      onUpdateNode(selectedTask.id, { label: newName });
    }
  };

  const handleStatusChange = (newStatus: TaskNodeData['status']) => {
    if (selectedTask) {
      onUpdateNode(selectedTask.id, { status: newStatus });
    }
  };

  const handleArchiveToggle = () => {
    if (selectedTask) {
      const newArchivedState = !selectedTask.data.archived;
      onUpdateNode(selectedTask.id, {
        archived: newArchivedState,
        archivedAt: newArchivedState ? new Date() : undefined,
      });
    }
  };

  if (!selectedTask) {
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
        {selectedArchivedTask && (
          <span className="ml-2 rounded bg-gray-200 px-2 py-1 text-xs font-normal text-gray-600">
            Archived
          </span>
        )}
      </h2>

      {/* Task Name */}
      <div className="mb-4">
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Task Name
        </label>
        <input
          type="text"
          value={selectedTask.data.label}
          onChange={(e) => handleNameChange(e.target.value)}
          className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      </div>

      {/* Status */}
      <div className="mb-4">
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Status
        </label>
        <select
          value={selectedTask.data.status || 'pending'}
          onChange={(e) =>
            handleStatusChange(e.target.value as TaskNodeData['status'])
          }
          className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
        >
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      {/* Archived Status */}
      <div className="mb-4">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={selectedTask.data.archived || false}
            onChange={handleArchiveToggle}
            className="mr-2"
          />
          <span className="text-sm font-medium text-gray-700">
            {selectedTask.data.archived
              ? 'Restore to board'
              : 'Archive (remove from board)'}
          </span>
        </label>
        {selectedTask.data.archived && selectedTask.data.archivedAt && (
          <p className="mt-1 text-xs text-gray-500">
            Archived on{' '}
            {new Date(selectedTask.data.archivedAt).toLocaleDateString()}
          </p>
        )}
      </div>

      {/* Task ID (read-only) */}
      <div className="mb-4">
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Task ID
        </label>
        <input
          type="text"
          value={selectedTask.id}
          readOnly
          className="w-full cursor-not-allowed rounded-md border border-gray-300 bg-gray-100 px-3 py-2 text-gray-600"
        />
      </div>

      {/* Position (read-only) */}
      <div className="mb-4">
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Position
        </label>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="text"
            value={Math.round(selectedTask.position.x)}
            readOnly
            className="cursor-not-allowed rounded-md border border-gray-300 bg-gray-100 px-3 py-2 text-gray-600"
            placeholder="X"
          />
          <input
            type="text"
            value={Math.round(selectedTask.position.y)}
            readOnly
            className="cursor-not-allowed rounded-md border border-gray-300 bg-gray-100 px-3 py-2 text-gray-600"
            placeholder="Y"
          />
        </div>
      </div>
    </div>
  );
}
