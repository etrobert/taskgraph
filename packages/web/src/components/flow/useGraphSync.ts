import { useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { trpc } from '../../utils/trpc';
import { getTaskNodeFromTask } from '@/lib/getTaskNodeFromTask';
import type { NodeType } from './TaskGraphFlow';
import type { Edge } from '@xyflow/react';

export function useGraphSync(
  organizationId: string | undefined,
  selection: { nodes: NodeType[] },
  setNodes: (nodes: NodeType[]) => void,
  setEdges: (edges: Edge[]) => void,
) {
  const { data: graph } = useQuery(
    trpc.graph.queryOptions(
      { organizationId: organizationId! },
      { enabled: !!organizationId },
    ),
  );

  const previousGraph = useRef<typeof graph>(undefined);

  useEffect(() => {
    if (graph === undefined) return;
    if (previousGraph.current === graph) return;
    previousGraph.current = graph;
    const { projects, tasks, dependencies } = graph;

    const allNodes = [
      // Create project nodes
      ...projects.map(
        ({ id, position, width, height, ...data }) =>
          ({
            id,
            type: 'project',
            position,
            width,
            height,
            selected: selection.nodes.some((node) => node.id === id),
            data,
          }) as const,
      ),
      // Create task nodes
      ...tasks.map((task) => getTaskNodeFromTask(task, selection.nodes)),
    ];

    setNodes(allNodes);
    setEdges(
      dependencies.map((dependency) => ({
        id: dependency.id,
        source: dependency.blockingTaskId,
        target: dependency.blockedTaskId,
      })),
    );
  }, [selection.nodes, graph, setNodes, setEdges]);

  return graph;
}
