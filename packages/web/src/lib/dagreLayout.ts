import dagre from '@dagrejs/dagre';
import type { Edge } from '@xyflow/react';
import type { NodeType } from '@/components/flow/TaskGraphFlow';

export const applyDagreLayout = (
  nodes: NodeType[],
  edges: Edge[],
  showArchived: boolean,
): NodeType[] => {
  const dagreGraph = new dagre.graphlib.Graph({ compound: true });
  dagreGraph.setDefaultEdgeLabel(() => ({}));

  dagreGraph.setGraph({ rankdir: 'LR' });

  const isHidden = (node: NodeType) =>
    node.data.archivedAt !== null && !showArchived;

  // Add nodes to dagre graph
  nodes.forEach((node) => {
    if (isHidden(node)) return;
    dagreGraph.setNode(node.id, {
      width: node.measured?.width ?? 0,
      height: node.measured?.height ?? 0,
    });
    if (node.parentId) dagreGraph.setParent(node.id, node.parentId);
  });

  // Add edges to dagre graph
  edges.forEach((edge) => dagreGraph.setEdge(edge.source, edge.target));

  // Calculate layout
  dagre.layout(dagreGraph);

  // Apply calculated positions back to nodes
  return nodes
    .filter((node) => !isHidden(node))
    .map((node) => {
      const { x, y, width, height } = dagreGraph.node(node.id);

      const parent = node.parentId
        ? dagreGraph.node(node.parentId)
        : { x: 0, y: 0, width: 0, height: 0 };

      const parentPos = {
        x: parent.x - parent.width / 2,
        y: parent.y - parent.height / 2,
      };

      return {
        ...node,
        hidden: isHidden(node),
        width: width === 0 ? undefined : width,
        height: height === 0 ? undefined : height,
        position: {
          x: x - width / 2 - parentPos.x,
          y: y - height / 2 - parentPos.y,
        },
      };
    });
};
