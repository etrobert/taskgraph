import React, {useState} from "../../snowpack/pkg/react.js";
import {addTask, clearGraph, completeSelected, deleteSelected} from "../graph.js";
import MenuBar from "./MenuBar/MenuBar.js";
import useAppShortcuts from "./useAppShortcuts.js";
import Toolbar from "./Toolbar/Toolbar.js";
import useTasksSelected from "./useTasksSelected.js";
import GraphCanvas from "./GraphCanvas/GraphCanvas.js";
import NewTaskInput from "./NewTaskInput/NewTaskInput.js";
import "./App.css.proxy.js";
const App = () => {
  const [menuBarOpen, setMenuBarOpen] = useState(false);
  const closeMenuBar = () => setMenuBarOpen(false);
  const [linkMode, setLinkMode] = useState(false);
  const [insertMode, setInsertMode] = useState(false);
  const onCreateTask = () => setInsertMode(true);
  const tasksSelected = useTasksSelected();
  useAppShortcuts({
    insertMode,
    onDelete: deleteSelected,
    onCreateTask
  });
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("button", {
    className: "App__menu-bar-open-button iconButton",
    onClick: () => setMenuBarOpen(true)
  }), /* @__PURE__ */ React.createElement(MenuBar, {
    open: menuBarOpen,
    onClose: closeMenuBar,
    onNewGraph: () => {
      clearGraph();
      closeMenuBar();
    }
  }), /* @__PURE__ */ React.createElement(Toolbar, {
    tasksSelected,
    linkMode,
    onChangeLinkMode: () => setLinkMode((mode) => !mode),
    onCreateTask,
    onComplete: () => {
      completeSelected();
    },
    onDelete: deleteSelected
  }), /* @__PURE__ */ React.createElement(GraphCanvas, null), insertMode && /* @__PURE__ */ React.createElement(NewTaskInput, {
    onNewTask: (task) => {
      addTask(task);
      setInsertMode(false);
    },
    onCancel: () => setInsertMode(false)
  }));
};
export default App;
