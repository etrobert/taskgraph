import { Button } from '../ui/button';
import { useMutation } from '@tanstack/react-query';
import { trpc } from '../../utils/trpc';
import type { NodeType } from './TaskGraphFlow';

interface ToolbarProps {
  isComputedView: boolean;
  onToggleComputedView: () => void;
  organizationId: string | undefined;
  nodes: NodeType[];
  showArchived: boolean;
  onToggleShowArchived: () => void;
}

export function Toolbar({
  isComputedView,
  onToggleComputedView,
  organizationId,
  nodes,
  showArchived,
  onToggleShowArchived,
}: ToolbarProps) {
  const archiveCompletedMutation = useMutation(
    trpc.archiveCompleted.mutationOptions(),
  );

  const handleArchiveCompleted = () => {
    if (!organizationId) return;
    archiveCompletedMutation.mutate({ organizationId });
  };

  // Check if there are any completed, non-archived tasks or projects visible
  const hasCompletedItems = nodes.some(
    (node) => node.data.status === 'completed' && !node.data.archivedAt,
  );

  return (
    <div className="absolute bottom-4 left-4 z-10 flex gap-2">
      <Button
        variant={isComputedView ? 'default' : 'outline'}
        onClick={onToggleComputedView}
      >
        {isComputedView ? 'Spatial View' : 'Computed View'}
      </Button>
      {isComputedView && (
        <Button
          variant={showArchived ? 'default' : 'outline'}
          onClick={onToggleShowArchived}
        >
          {showArchived ? 'Hide Archived' : 'Show Archived'}
        </Button>
      )}
      {hasCompletedItems && (
        <Button
          variant="destructive"
          onClick={handleArchiveCompleted}
          disabled={archiveCompletedMutation.isPending}
        >
          {archiveCompletedMutation.isPending
            ? 'Archiving...'
            : 'Archive Completed'}
        </Button>
      )}
    </div>
  );
}
