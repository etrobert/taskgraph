import React, { useEffect, useRef, useState } from "react";
import { closeMenubar } from ".";
import GraphInput from "./GraphInput";
import {
  clearGraph,
  completeSelected,
  deleteSelected,
  Graph,
  loadGraph,
} from "./graph";
import MenuBar from "./MenuBar";
import { saveToFile, saveToLocalStorage } from "./storage";
import useAppShortcuts from "./useAppShortcuts";
import Toolbar from "./Toolbar";
import { getElementById } from "./misc";

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

  const [tasksSelected, setTasksSelected] = useState(false);

  // Update tasksSelected when the graph sends a selectionchanged event
  useEffect(() => {
    const onSelectionChanged = (event: Event) => {
      const customEvent = event as CustomEvent<HTMLElement[]>;
      setTasksSelected(customEvent.detail.length > 0);
    };
    const graph = getElementById("graph");
    graph.addEventListener("selectionchanged", onSelectionChanged);
    return () =>
      graph.removeEventListener("selectionchanged", onSelectionChanged);
  });

  const [linkMode, setLinkMode] = useState(false);

  const renderToolbar = () => {
    const onCreateTask = () => {
      const newTask = getElementById("newTask");
      newTask.style.display = "block";
      newTask.focus();
    };

    const onChangeLinkMode = () => setLinkMode((linkMode) => !linkMode);

    const onComplete = () => {
      completeSelected();
      saveToLocalStorage();
    };

    const onDelete = () => {
      deleteSelected();
      saveToLocalStorage();
    };

    return tasksSelected ? (
      <Toolbar
        tasksSelected={true}
        onComplete={onComplete}
        onDelete={onDelete}
      />
    ) : (
      <Toolbar
        tasksSelected={false}
        linkMode={linkMode}
        onCreateTask={onCreateTask}
        onChangeLinkMode={onChangeLinkMode}
      />
    );
  };

  useAppShortcuts(loadFromFile);

  return (
    <>
      {renderGraphInput()}
      {renderMenuBar()}
      {renderToolbar()}
    </>
  );
};

export default App;
