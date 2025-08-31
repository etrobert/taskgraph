import { type Node, type Edge } from 'reactflow';

export interface TaskGraphFileData {
  nodes: Node[];
  edges: Edge[];
  version: string;
  exportedAt: string;
}

export const saveToFile = (nodes: Node[], edges: Edge[]) => {
  const data: TaskGraphFileData = {
    nodes,
    edges,
    version: '1.0',
    exportedAt: new Date().toISOString(),
  };
  
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: 'application/json',
  });
  
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `taskgraph-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const loadFromFile = (
  file: File,
  onSuccess: (nodes: Node[], edges: Edge[]) => void,
  onError: (message: string) => void
) => {
  const reader = new FileReader();
  
  reader.onload = (e) => {
    try {
      const content = e.target?.result as string;
      const data = JSON.parse(content) as TaskGraphFileData;
      
      // Validate the data structure
      if (data.nodes && data.edges && Array.isArray(data.nodes) && Array.isArray(data.edges)) {
        onSuccess(data.nodes, data.edges);
      } else {
        onError('Invalid file format. Please select a valid TaskGraph JSON file.');
      }
    } catch (error) {
      onError('Error reading file. Please ensure it\'s a valid JSON file.');
    }
  };
  
  reader.readAsText(file);
};