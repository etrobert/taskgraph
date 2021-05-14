import React, {useRef, useState} from "../../snowpack/pkg/react.js";
import {
  clearGraph,
  completeSelected,
  deleteSelected,
  loadGraph
} from "../graph.js";
import {getElementById} from "../misc.js";
import {saveToFile, saveToLocalStorage} from "../storage.js";
import MenuBar from "./MenuBar/MenuBar.js";
import useAppShortcuts from "./useAppShortcuts.js";
import Toolbar from "./Toolbar/Toolbar.js";
import GraphInput from "./GraphInput.js";
import useTasksSelected from "./useTasksSelected.js";
import GraphComponent from "./Graph/Graph.js";
export const closeMenubar = () => {
  const menubar = getElementById("menubar");
  menubar.classList.remove("active");
};
const App = () => {
  const fileInputRef = useRef(null);
  const loadFromFile = () => fileInputRef.current?.click();
  const [linkMode, setLinkMode] = useState(false);
  const tasksSelected = useTasksSelected();
  useAppShortcuts(loadFromFile);
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(GraphInput, {
    onLoad: (graph) => {
      loadGraph(graph);
      saveToLocalStorage();
      closeMenubar();
    },
    ref: fileInputRef
  }), /* @__PURE__ */ React.createElement(MenuBar, {
    onClose: closeMenubar,
    onLoad: loadFromFile,
    onNewGraph: () => {
      clearGraph();
      closeMenubar();
    },
    onSave: () => {
      saveToFile();
      closeMenubar();
    }
  }), /* @__PURE__ */ React.createElement(Toolbar, {
    tasksSelected,
    linkMode,
    onChangeLinkMode: () => setLinkMode((mode) => !mode),
    onCreateTask: () => {
      const newTask = getElementById("newTask");
      newTask.style.display = "block";
      newTask.focus();
    },
    onComplete: () => {
      completeSelected();
      saveToLocalStorage();
    },
    onDelete: () => {
      deleteSelected();
      saveToLocalStorage();
    }
  }), /* @__PURE__ */ React.createElement(GraphComponent, null));
};
export default App;
