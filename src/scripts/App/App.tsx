import React, { useRef, useState } from "react";

import {
  addTask,
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
import NewTask from "./NewTask/NewTask";

import "./App.css";

const App = (): JSX.Element => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadFromFile = () => fileInputRef.current?.click();

  const [menuBarOpen, setMenuBarOpen] = useState(false);
  const closeMenuBar = () => setMenuBarOpen(false);

  const [linkMode, setLinkMode] = useState(false);

  const [insertMode, setInsertMode] = useState(false);
  const openNewTask = () => setInsertMode(true);

  const tasksSelected = useTasksSelected();

  useAppShortcuts({ loadFromFile, insertMode, openNewTask });

  return (
    <>
      <GraphInput
        onLoad={(graph) => {
          loadGraph(graph);
          saveToLocalStorage();
          closeMenuBar();
        }}
        ref={fileInputRef}
      />

      <button
        className="App__menu-bar-open-button iconButton"
        onClick={() => setMenuBarOpen(true)}
      />
      <MenuBar
        open={menuBarOpen}
        onClose={closeMenuBar}
        onLoad={loadFromFile}
        onNewGraph={() => {
          clearGraph();
          closeMenuBar();
        }}
        onSave={() => {
          saveToFile();
          closeMenuBar();
        }}
      />

      <Toolbar
        tasksSelected={tasksSelected}
        linkMode={linkMode}
        onChangeLinkMode={() => setLinkMode((mode) => !mode)}
        onCreateTask={openNewTask}
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

      {insertMode && (
        <NewTask
          onNewTask={(task) => {
            addTask(task);
            saveToLocalStorage();
            setInsertMode(false);
          }}
          onCancel={() => setInsertMode(false)}
        />
      )}
    </>
  );
};

export default App;
