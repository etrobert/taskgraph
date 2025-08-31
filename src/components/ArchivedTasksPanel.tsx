import { type Node } from 'reactflow';
import { type TaskNodeData } from './TaskNode';

interface ArchivedTasksPanelProps {
  archivedTasks: Node<TaskNodeData>[];
  selectedArchivedTask: Node<TaskNodeData> | null;
  onSelectArchivedTask: (task: Node<TaskNodeData>) => void;
  onRestoreTask: (taskId: string) => void;
}

export function ArchivedTasksPanel({
  archivedTasks,
  selectedArchivedTask,
  onSelectArchivedTask,
  onRestoreTask,
}: ArchivedTasksPanelProps) {
  return (
    <div className="h-full w-64 border-r border-gray-200 bg-gray-50">
      <div className="border-b border-gray-200 p-4">
        <h2 className="text-lg font-semibold text-gray-700">Archived Tasks</h2>
        <p className="text-sm text-gray-500">
          {archivedTasks.length} task{archivedTasks.length !== 1 ? 's' : ''}
        </p>
      </div>

      <div className="flex-1 overflow-y-auto">
        {archivedTasks.length === 0 ? (
          <div className="p-4">
            <p className="text-sm text-gray-500">No archived tasks</p>
          </div>
        ) : (
          <div className="space-y-1 p-2">
            {archivedTasks.map((task) => (
              <div
                key={task.id}
                onClick={() => onSelectArchivedTask(task)}
                className={`cursor-pointer rounded-md border p-3 transition-colors ${
                  selectedArchivedTask?.id === task.id
                    ? 'border-blue-300 bg-blue-50'
                    : 'border-gray-200 bg-white hover:bg-gray-50'
                }`}
              >
                <div className="mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-400">
                      {task.data.status === 'completed'
                        ? '✓'
                        : task.data.status === 'in-progress'
                          ? '⏳'
                          : '○'}
                    </span>
                    <span className="flex-1 truncate text-sm font-medium text-gray-700">
                      {task.data.label}
                    </span>
                  </div>
                  {task.data.archivedAt && (
                    <p className="mt-1 text-xs text-gray-400">
                      Archived{' '}
                      {new Date(task.data.archivedAt).toLocaleDateString()}
                    </p>
                  )}
                </div>

                <div className="flex gap-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onRestoreTask(task.id);
                    }}
                    className="rounded px-2 py-1 text-xs text-blue-600 hover:bg-blue-100"
                    title="Restore to board"
                  >
                    Restore
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
