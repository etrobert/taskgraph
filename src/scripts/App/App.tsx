import React, { useRef, useState } from "react";

import {
  clearGraph,
  completeSelected,
  deleteSelected,
  loadGraph,
} from "@/graph";
import { getElementById } from "@/misc";
import { saveToFile, saveToLocalStorage } from "@/storage";

import MenuBar from "./MenuBar/MenuBar";
import useAppShortcuts from "./useAppShortcuts";
import Toolbar from "./Toolbar/Toolbar";
import GraphInput from "./GraphInput";
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

      <Toolbar
        tasksSelected={tasksSelected}
        linkMode={linkMode}
        onChangeLinkMode={() => setLinkMode((mode) => !mode)}
        onCreateTask={() => {
          const newTask = getElementById("newTask");
          newTask.style.display = "block";
          newTask.focus();
        }}
        onComplete={() => {
          completeSelected();
          saveToLocalStorage();
        }}
        onDelete={() => {
          deleteSelected();
          saveToLocalStorage();
        }}
      />

      <GraphComponent />
    </>
  );
};

export default App;
