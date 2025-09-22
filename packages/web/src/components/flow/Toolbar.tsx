import { Button } from '../ui/button';
import { useMutation } from '@tanstack/react-query';
import { trpc } from '../../utils/trpc';
import type { NodeType } from './TaskGraphFlow';

interface ToolbarProps {
  isComputedView: boolean;
  onToggleComputedView: () => void;
  organizationId: string | undefined;
  nodes: NodeType[];
}

export function Toolbar({
  isComputedView,
  onToggleComputedView,
  organizationId,
  nodes,
}: ToolbarProps) {
  const archiveCompletedTasksMutation = useMutation(
    trpc.archiveCompletedTasks.mutationOptions(),
  );

  const handleArchiveCompleted = () => {
    if (!organizationId) return;
    archiveCompletedTasksMutation.mutate({ organizationId });
  };

  // Check if there are any completed, non-archived tasks visible
  const hasCompletedTasks = nodes.some(
    (node) =>
      node.type === 'task' &&
      node.data.status === 'completed' &&
      !node.data.archivedAt,
  );

  return (
    <div className="absolute bottom-4 left-4 z-10 flex gap-2">
      <Button
        variant={isComputedView ? 'default' : 'outline'}
        onClick={onToggleComputedView}
      >
        {isComputedView ? 'Spatial View' : 'Computed View'}
      </Button>
      {hasCompletedTasks && (
        <Button
          variant="destructive"
          onClick={handleArchiveCompleted}
          disabled={archiveCompletedTasksMutation.isPending}
        >
          {archiveCompletedTasksMutation.isPending
            ? 'Archiving...'
            : 'Archive Completed'}
        </Button>
      )}
    </div>
  );
}
