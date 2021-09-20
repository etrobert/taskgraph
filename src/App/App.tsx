import React, { useState } from "react";

import { addTask, clearGraph, completeSelected, deleteSelected } from "@/graph";

import MenuBar from "./MenuBar/MenuBar";
import useAppShortcuts from "./useAppShortcuts";
import Toolbar from "./Toolbar/Toolbar";
import useTasksSelected from "./useTasksSelected";
import GraphCanvas from "./GraphCanvas/GraphCanvas";
import NewTaskInput from "./NewTaskInput/NewTaskInput";

import "./App.css";
import ThemeProvider from "@/theme/ThemeProvider";

const App = (): JSX.Element => {
  const [menuBarOpen, setMenuBarOpen] = useState(false);
  const closeMenuBar = () => setMenuBarOpen(false);

  const [linkMode, setLinkMode] = useState(false);

  const [insertMode, setInsertMode] = useState(false);
  const onCreateTask = () => setInsertMode(true);

  const tasksSelected = useTasksSelected();

  useAppShortcuts({
    insertMode,
    onDelete: deleteSelected,
    onCreateTask,
  });

  return (
    <ThemeProvider>
      <button
        className="App__menu-bar-open-button iconButton"
        onClick={() => setMenuBarOpen(true)}
      />
      <MenuBar
        open={menuBarOpen}
        onClose={closeMenuBar}
        onNewGraph={() => {
          clearGraph();
          closeMenuBar();
        }}
      />

      <Toolbar
        tasksSelected={tasksSelected}
        linkMode={linkMode}
        onChangeLinkMode={() => setLinkMode((mode) => !mode)}
        onCreateTask={onCreateTask}
        onComplete={() => {
          completeSelected();
        }}
        onDelete={deleteSelected}
      />

      <GraphCanvas />

      {insertMode && (
        <NewTaskInput
          onNewTask={(task) => {
            addTask(task);
            setInsertMode(false);
          }}
          onCancel={() => setInsertMode(false)}
        />
      )}
    </ThemeProvider>
  );
};

export default App;
