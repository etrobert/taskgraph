import React, { useRef } from "react";
import GraphInput from "./GraphInput";
import { clearGraph, Graph, loadGraph } from "./graph";
import MenuBar from "./MenuBar";
import { saveToFile, saveToLocalStorage } from "./storage";
import useAppShortcuts from "./useAppShortcuts";
import { getElementById } from "./misc";
import useTasksSelected from "./useTasksSelected";
import useToolbar from "./useToolbar";

export const closeMenubar = (): void => {
  const menubar = getElementById("menubar");

  menubar.classList.remove("active");
};

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

  const tasksSelected = useTasksSelected();

  const { toolbar } = useToolbar(tasksSelected);

  useAppShortcuts(loadFromFile);

  return (
    <>
      {renderGraphInput()}
      {renderMenuBar()}
      {toolbar}
    </>
  );
};

export default App;
