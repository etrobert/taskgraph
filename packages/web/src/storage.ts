import { type Node, type Edge } from 'reactflow';
import { z } from 'zod';

const STORAGE_KEY = 'taskgraph-data';

const taskNodeDataSchema = z.object({
  label: z.string(),
  status: z.enum(['pending', 'in-progress', 'completed']).optional(),
  description: z.string().optional(),
});

const nodeSchema = z.object({
  id: z.string(),
  type: z.string().optional(),
  data: taskNodeDataSchema,
  position: z.object({ x: z.number(), y: z.number() }),
  width: z.number().optional(),
  height: z.number().optional(),
  selected: z.boolean().optional(),
  dragging: z.boolean().optional(),
});

// Zod schema for ReactFlow Edge
const edgeSchema = z.object({
  id: z.string(),
  source: z.string(),
  target: z.string(),
  type: z.string().optional(),
  sourceHandle: z.string().nullish(),
  targetHandle: z.string().nullish(),
  animated: z.boolean().optional(),
  selected: z.boolean().optional(),
});

// Zod schema for TaskGraphData
const taskGraphDataSchema = z.object({
  nodes: z.array(nodeSchema),
  edges: z.array(edgeSchema),
});

export interface TaskGraphData {
  nodes: Node[];
  edges: Edge[];
}

export const saveToStorage = (nodes: Node[], edges: Edge[]): void => {
  try {
    const data = { nodes, edges } satisfies TaskGraphData;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save to localStorage:', error);
  }
};

export const loadFromStorage = (): TaskGraphData | null => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return null;
    return taskGraphDataSchema.parse(JSON.parse(data));
  } catch (error) {
    console.error('Failed to load from localStorage:', error);
    return null;
  }
};

export const clearStorage = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear localStorage:', error);
  }
};
