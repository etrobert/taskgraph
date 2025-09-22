import dagre from 'dagre';
import type { Edge } from '@xyflow/react';
import type { NodeType } from '@/components/flow/TaskGraphFlow';

const dagreGraph = new dagre.graphlib.Graph({ compound: true });
dagreGraph.setDefaultEdgeLabel(() => ({}));

export const applyDagreLayout = (
  nodes: NodeType[],
  edges: Edge[],
): NodeType[] => {
  dagreGraph.setGraph({ rankdir: 'LR', nodesep: 60, ranksep: 150 });

  // Add nodes to dagre graph
  nodes.forEach((node) => {
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
  return nodes.map((node) => {
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
      width,
      height,
      position: {
        x: x - width / 2 - parentPos.x,
        y: y - height / 2 - parentPos.y,
      },
    };
  });
};
