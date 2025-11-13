import { Label } from './ui/label';
import { useQuery } from '@tanstack/react-query';
import { useTRPC } from '../utils/trpc';
import { useOrganizationId } from '@/hooks/useOrganizationId';

interface HiddenDependenciesInfoProps {
  nodeId: string;
}

export function HiddenDependenciesInfo({
  nodeId,
}: HiddenDependenciesInfoProps) {
  const trpc = useTRPC();
  const organizationId = useOrganizationId();
  const { data: graph } = useQuery(
    trpc.graph.queryOptions(
      { organizationId: organizationId! },
      { enabled: !!organizationId },
    ),
  );

  if (!graph) return null;

  const allNodes = [...graph.tasks, ...graph.projects];

  const incoming = graph.dependencies.filter((dep) => {
    if (dep.target !== nodeId) return false;
    const sourceNode = allNodes.find((n) => n.id === dep.source);
    return sourceNode?.archivedAt !== null;
  }).length;

  const outgoing = graph.dependencies.filter((dep) => {
    if (dep.source !== nodeId) return false;
    const targetNode = allNodes.find((n) => n.id === dep.target);
    return targetNode?.archivedAt !== null;
  }).length;

  if (incoming === 0 && outgoing === 0) return null;

  return (
    <>
      <Label>Hidden Dependencies</Label>
      <div className="text-muted-foreground grid gap-1 text-sm">
        {incoming > 0 && (
          <div>
            Incoming: {incoming} archived {incoming === 1 ? 'node' : 'nodes'}
          </div>
        )}
        {outgoing > 0 && (
          <div>
            Outgoing: {outgoing} archived {outgoing === 1 ? 'node' : 'nodes'}
          </div>
        )}
      </div>
    </>
  );
}
