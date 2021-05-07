import React, {useRef, useState} from "../snowpack/pkg/react.js";
import {closeMenubar} from "./index.js";
import GraphInput from "./GraphInput.js";
import {
  clearGraph,
  completeSelected,
  deleteSelected,
  loadGraph
} from "./graph.js";
import MenuBar from "./MenuBar.js";
import {saveToFile, saveToLocalStorage} from "./storage.js";
import useAppShortcuts from "./useAppShortcuts.js";
import Toolbar from "./Toolbar.js";
import {getElementById} from "./misc.js";
import useTasksSelected from "./useTasksSelected.js";
const App = () => {
  const fileInputRef = useRef(null);
  const renderGraphInput = () => {
    const onLoad = (graph) => {
      loadGraph(graph);
      saveToLocalStorage();
      closeMenubar();
    };
    return /* @__PURE__ */ React.createElement(GraphInput, {
      onLoad,
      ref: fileInputRef
    });
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
    return /* @__PURE__ */ React.createElement(MenuBar, {
      onClose: closeMenubar,
      onLoad: loadFromFile,
      onNewGraph,
      onSave
    });
  };
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
    return tasksSelected ? /* @__PURE__ */ React.createElement(Toolbar, {
      tasksSelected: true,
      onComplete,
      onDelete
    }) : /* @__PURE__ */ React.createElement(Toolbar, {
      tasksSelected: false,
      linkMode,
      onCreateTask,
      onChangeLinkMode
    });
  };
  useAppShortcuts(loadFromFile);
  return /* @__PURE__ */ React.createElement(React.Fragment, null, renderGraphInput(), renderMenuBar(), renderToolbar());
};
export default App;
