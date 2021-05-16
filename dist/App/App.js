import React, {useRef, useState} from "../../snowpack/pkg/react.js";
import {
  addTask,
  clearGraph,
  completeSelected,
  deleteSelected,
  loadGraph
} from "../graph.js";
import {saveToFile, saveToLocalStorage} from "../storage.js";
import MenuBar from "./MenuBar/MenuBar.js";
import useAppShortcuts from "./useAppShortcuts.js";
import Toolbar from "./Toolbar/Toolbar.js";
import GraphInput from "./GraphInput.js";
import useTasksSelected from "./useTasksSelected.js";
import GraphComponent from "./Graph/Graph.js";
import NewTaskInput from "./NewTaskInput/NewTaskInput.js";
import "./App.css.proxy.js";
const App = () => {
  const fileInputRef = useRef(null);
  const loadFromFile = () => fileInputRef.current?.click();
  const [menuBarOpen, setMenuBarOpen] = useState(false);
  const closeMenuBar = () => setMenuBarOpen(false);
  const [linkMode, setLinkMode] = useState(false);
  const [insertMode, setInsertMode] = useState(false);
  const onCreateTask = () => setInsertMode(true);
  const tasksSelected = useTasksSelected();
  useAppShortcuts({loadFromFile, insertMode, onCreateTask});
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(GraphInput, {
    onLoad: (graph) => {
      loadGraph(graph);
      saveToLocalStorage();
      closeMenuBar();
    },
    ref: fileInputRef
  }), /* @__PURE__ */ React.createElement("button", {
    className: "App__menu-bar-open-button iconButton",
    onClick: () => setMenuBarOpen(true)
  }), /* @__PURE__ */ React.createElement(MenuBar, {
    open: menuBarOpen,
    onClose: closeMenuBar,
    onLoad: loadFromFile,
    onNewGraph: () => {
      clearGraph();
      closeMenuBar();
    },
    onSave: () => {
      saveToFile();
      closeMenuBar();
    }
  }), /* @__PURE__ */ React.createElement(Toolbar, {
    tasksSelected,
    linkMode,
    onChangeLinkMode: () => setLinkMode((mode) => !mode),
    onCreateTask,
    onComplete: () => {
      completeSelected();
      saveToLocalStorage();
    },
    onDelete: () => {
      deleteSelected();
      saveToLocalStorage();
    }
  }), /* @__PURE__ */ React.createElement(GraphComponent, null), insertMode && /* @__PURE__ */ React.createElement(NewTaskInput, {
    onNewTask: (task) => {
      addTask(task);
      saveToLocalStorage();
      setInsertMode(false);
    },
    onCancel: () => setInsertMode(false)
  }));
};
export default App;
