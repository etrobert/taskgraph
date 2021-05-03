import React, { useRef } from "react";
import { closeMenubar } from ".";
import GraphInput from "./GraphInput";
import { clearGraph, Graph, loadGraph } from "./graph";
import MenuBar from "./MenuBar";
import { saveToFile, saveToLocalStorage } from "./storage";
import useAppShortcuts from "./useAppShortcuts";

const App = (): JSX.Element => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const renderGraphInput = () => {
    const onLoad = (graph: Graph) => {
      loadGraph(graph);
      saveToLocalStorage();
      closeMenubar();
    };

    return <GraphInput onLoad={onLoad} ref={fileInputRef} />;
  };

  const loadFromFile = () => fileInputRef.current?.click();

  const renderMenuBar = () => {
    const onSave = () => {
      saveToFile();
      closeMenubar();
    };

    const onNewGraph = () => {
      clearGraph();
      closeMenubar();
    };

    return (
      <MenuBar
        onClose={closeMenubar}
        onLoad={loadFromFile}
        onNewGraph={onNewGraph}
        onSave={onSave}
      />
    );
  };

  useAppShortcuts(loadFromFile);

  return (
    <>
      {renderGraphInput()}
      {renderMenuBar()}
    </>
  );
};

export default App;
