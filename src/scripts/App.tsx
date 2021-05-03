import React, { useRef } from "react";
import { closeMenubar } from ".";
import GraphInput from "./GraphInput";
import { clearGraph, Graph, loadGraph } from "./graph";
import MenuBar from "./MenuBar";
import { saveToFile, saveToLocalStorage } from "./storage";
import useAppShortcuts from "./useAppShortcuts";

const App = (): JSX.Element => {
  const onSave = () => {
    saveToFile();
    closeMenubar();
  };

  const onNewGraph = () => {
    clearGraph();
    closeMenubar();
  };

  const onLoad = (graph: Graph) => {
    loadGraph(graph);
    saveToLocalStorage();
    closeMenubar();
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadFromFile = () => fileInputRef.current?.click();

  useAppShortcuts(loadFromFile);

  return (
    <>
      <GraphInput onLoad={onLoad} ref={fileInputRef} />
      <MenuBar
        onClose={closeMenubar}
        onLoad={loadFromFile}
        onNewGraph={onNewGraph}
        onSave={onSave}
      />
    </>
  );
};

export default App;
