import React, { useCallback, useEffect, useRef, useState } from "react";

import {
  addTask,
  clearGraph,
  completeSelected,
  deleteSelected,
  loadGraph,
  getGraph,
  Graph as GraphData,
} from "@/graph";
import { saveToFile, saveToLocalStorage } from "@/storage";

import MenuBar from "./MenuBar/MenuBar";
import useAppShortcuts from "./useAppShortcuts";
import Toolbar from "./Toolbar/Toolbar";
import GraphInput from "./GraphInput";
import useTasksSelected from "./useTasksSelected";
import GraphCanvas from "./GraphCanvas/GraphCanvas";
import NewTaskInput from "./NewTaskInput/NewTaskInput";

import "./App.css";
import { RecoilRoot } from "recoil";
import { dependencyStateFamily, graphState, taskStateFamily } from "./atoms";

const graphMockState = {
  tasks: ["task-1", "task-2"],
  dependencies: ["dependency-1"],
};

const task1Mock = {
  id: "task-1",
  name: "task-1",
  position: { x: 0, y: 0 },
};

const task2Mock = {
  id: "task-2",
  name: "task-2",
  position: { x: 0, y: 0 },
};

const dependencyMock = {
  id: "dependency-1",
  predecessor: "task-1",
  successor: "task-2",
};

const App = (): JSX.Element => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadFromFile = () => fileInputRef.current?.click();

  const [menuBarOpen, setMenuBarOpen] = useState(false);
  const closeMenuBar = () => setMenuBarOpen(false);

  const [linkMode, setLinkMode] = useState(false);

  const [insertMode, setInsertMode] = useState(false);
  const onCreateTask = () => setInsertMode(true);

  const tasksSelected = useTasksSelected();

  const [graph, setGraph] = useState<GraphData>();
  const updateGraph = useCallback(() => setGraph(getGraph()), []);

  // Update localstorage when graph is updated
  useEffect(() => graph && saveToLocalStorage(graph), [graph]);

  const onDelete = () => {
    deleteSelected();
    updateGraph();
  };

  useAppShortcuts({ loadFromFile, insertMode, onDelete, onCreateTask });

  return (
    <RecoilRoot
      initializeState={({ set }) => {
        set(graphState, graphMockState);
        set(taskStateFamily("task-1"), task1Mock);
        set(taskStateFamily("task-2"), task2Mock);
        set(dependencyStateFamily("dependency-1"), dependencyMock);
      }}
    >
      <GraphInput
        onLoad={(graph) => {
          loadGraph(graph);
          updateGraph();
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
          updateGraph();
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
        onCreateTask={onCreateTask}
        onComplete={() => {
          completeSelected();
          updateGraph();
        }}
        onDelete={onDelete}
      />

      <GraphCanvas updateGraph={updateGraph} />

      {insertMode && (
        <NewTaskInput
          onNewTask={(task) => {
            addTask(task);
            updateGraph();
            setInsertMode(false);
          }}
          onCancel={() => setInsertMode(false)}
        />
      )}
    </RecoilRoot>
  );
};

export default App;
