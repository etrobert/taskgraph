import { Node, Edge } from 'reactflow';

const STORAGE_KEY = 'taskgraph-data';

export interface TaskGraphData {
  nodes: Node[];
  edges: Edge[];
}

export const saveToStorage = (nodes: Node[], edges: Edge[]): void => {
  try {
    const data: TaskGraphData = { nodes, edges };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save to localStorage:', error);
  }
};

export const loadFromStorage = (): TaskGraphData | null => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return null;
    return JSON.parse(data) as TaskGraphData;
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