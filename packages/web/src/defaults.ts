import type { Node, Edge } from 'reactflow';

export const defaultNodes: Node[] = [
  // Starting tasks (leftmost)
  {
    id: '1',
    type: 'task',
    position: { x: 0, y: 50 },
    data: {
      label: 'Research Requirements',
      status: 'completed',
      description: 'Analyze market needs and define project requirements',
    },
  },
  {
    id: '2',
    type: 'task',
    position: { x: 0, y: 150 },
    data: { label: 'Gather Resources', status: 'completed' },
  },
  {
    id: '3',
    type: 'task',
    position: { x: 0, y: 250 },
    data: { label: 'Setup Environment', status: 'in progress' },
  },
  // Intermediate tasks (middle)
  {
    id: '4',
    type: 'task',
    position: { x: 250, y: 100 },
    data: {
      label: 'Design System',
      status: 'in progress',
      description: 'Create wireframes and system architecture',
    },
  },
  {
    id: '5',
    type: 'task',
    position: { x: 250, y: 200 },
    data: { label: 'Implement Features', status: 'pending' },
  },
  // Final goal (rightmost)
  {
    id: '6',
    type: 'task',
    position: { x: 500, y: 150 },
    data: { label: 'Launch Product', status: 'pending' },
  },
];

export const defaultEdges: Edge[] = [
  // Dependencies point to tasks that depend on them
  { id: 'e1-4', source: '1', target: '4' }, // Research Requirements → Design System
  { id: 'e2-4', source: '2', target: '4' }, // Gather Resources → Design System
  { id: 'e2-5', source: '2', target: '5' }, // Gather Resources → Implement Features
  { id: 'e3-5', source: '3', target: '5' }, // Setup Environment → Implement Features
  // Intermediate dependencies point to final goal
  { id: 'e4-6', source: '4', target: '6' }, // Design System → Launch Product
  { id: 'e5-6', source: '5', target: '6' }, // Implement Features → Launch Product
];
