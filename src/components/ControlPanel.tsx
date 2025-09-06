import React from 'react';
import { type Node, type Edge } from 'reactflow';
import { saveToFile, loadFromFile } from '../fileOperations';

interface ControlPanelProps {
  nodes: Node[];
  edges: Edge[];
  onNodesChange: (nodes: Node[]) => void;
  onEdgesChange: (edges: Edge[]) => void;
  onClearStorage: () => void;
}

export function ControlPanel({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onClearStorage,
}: ControlPanelProps) {
  const handleSaveToFile = () => {
    saveToFile(nodes, edges);
  };

  const handleLoadFromFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    loadFromFile(
      file,
      (loadedNodes, loadedEdges) => {
        onNodesChange(loadedNodes);
        onEdgesChange(loadedEdges);
      },
      (errorMessage) => {
        alert(errorMessage);
      },
    );

    // Reset the input value so the same file can be loaded again
    event.target.value = '';
  };

  return (
    <div className="absolute right-5 bottom-5 z-10 flex flex-col gap-2">
      <button
        onClick={handleSaveToFile}
        className="rounded-md bg-green-500 px-4 py-2 text-sm font-medium text-white shadow-lg transition-colors duration-200 hover:bg-green-600"
      >
        Save to File
      </button>
      <label className="cursor-pointer rounded-md bg-purple-500 px-4 py-2 text-center text-sm font-medium text-white shadow-lg transition-colors duration-200 hover:bg-purple-600">
        Load from File
        <input
          type="file"
          accept=".json"
          onChange={handleLoadFromFile}
          className="hidden"
        />
      </label>
      <button
        onClick={onClearStorage}
        className="rounded-md bg-red-500 px-4 py-2 text-sm font-medium text-white shadow-lg transition-colors duration-200 hover:bg-red-600"
      >
        Clear Storage
      </button>
    </div>
  );
}
