import React, { useRef, useState } from "react";
import GraphInput from "./GraphInput";
import {
  clearGraph,
  completeSelected,
  deleteSelected,
  Graph,
  loadGraph,
} from "@/graph";
import MenuBar from "./MenuBar/MenuBar";
import { saveToFile, saveToLocalStorage } from "@/storage";
import useAppShortcuts from "./useAppShortcuts";
import Toolbar from "./Toolbar/Toolbar";
import { getElementById } from "@/misc";
import useTasksSelected from "./useTasksSelected";
import GraphComponent from "./Graph/Graph";

export const closeMenubar = (): void => {
  const menubar = getElementById("menubar");

  menubar.classList.remove("active");
};

const App = (): JSX.Element => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadFromFile = () => fileInputRef.current?.click();

  const [linkMode, setLinkMode] = useState(false);

  const tasksSelected = useTasksSelected();

  const renderToolbar = () => {
    const onCreateTask = () => {
      const newTask = getElementById("newTask");
      newTask.style.display = "block";
      newTask.focus();
    };

    const onChangeLinkMode = () => setLinkMode((state) => !state);

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
      <GraphInput
        onLoad={(graph) => {
          loadGraph(graph);
          saveToLocalStorage();
          closeMenubar();
        }}
        ref={fileInputRef}
      />

      <MenuBar
        onClose={closeMenubar}
        onLoad={loadFromFile}
        onNewGraph={() => {
          clearGraph();
          closeMenubar();
        }}
        onSave={() => {
          saveToFile();
          closeMenubar();
        }}
      />
      {renderToolbar()}
      <GraphComponent />
    </>
  );
};

export default App;
