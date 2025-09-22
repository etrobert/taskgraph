import dagre from 'dagre';
import type { Edge, Rect } from '@xyflow/react';
import type { NodeType } from '@/components/flow/TaskGraphFlow';

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

export const applyDagreLayout = (
  nodes: NodeType[],
  edges: Edge[],
  getNodesBounds: (node: NodeType[]) => Rect,
): NodeType[] => {
  dagreGraph.setGraph({ rankdir: 'LR', nodesep: 60, ranksep: 150 });

  // Add nodes to dagre graph
  nodes.forEach((node) => dagreGraph.setNode(node.id, getNodesBounds([node])));

  // Add edges to dagre graph
  edges.forEach((edge) => dagreGraph.setEdge(edge.source, edge.target));

  // Calculate layout
  dagre.layout(dagreGraph);

  // Apply calculated positions back to nodes
  return nodes.map((node) => {
    const { x, y } = dagreGraph.node(node.id);

    // PERF: We're calculating this twice in this function
    const { width, height } = getNodesBounds([node]);

    return { ...node, position: { x: x - width / 2, y: y - height / 2 } };
  });
};

