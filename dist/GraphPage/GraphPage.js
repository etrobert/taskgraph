import React, {useState} from "../../snowpack/pkg/react.js";
import {useRecoilValue} from "../../snowpack/pkg/recoil.js";
import useAppShortcuts from "../App/useAppShortcuts.js";
import MenuBar from "../App/MenuBar/MenuBar.js";
import Toolbar from "../App/Toolbar/Toolbar.js";
import GraphCanvas from "../App/GraphCanvas/GraphCanvas.js";
import NewTaskInput from "../App/NewTaskInput/NewTaskInput.js";
import useFirestoreState from "../useFirestoreState.js";
import useSyncFirestore from "../useSyncFirestore.js";
import {anyTasksSelectedSelector} from "../atoms.js";
import "./GraphPage.css.proxy.js";
const GraphPage = () => {
  const [menuBarOpen, setMenuBarOpen] = useState(false);
  const closeMenuBar = () => setMenuBarOpen(false);
  const [insertMode, setInsertMode] = useState(false);
  const onCreateTask = () => setInsertMode(true);
  const tasksSelected = useRecoilValue(anyTasksSelectedSelector);
  const {addTask} = useFirestoreState();
  useSyncFirestore();
  useAppShortcuts({
    insertMode,
    onDelete: () => {
    },
    onCreateTask
  });
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("button", {
    className: "GraphPage__menu-bar-open-button iconButton",
    onClick: () => setMenuBarOpen(true)
  }), /* @__PURE__ */ React.createElement(MenuBar, {
    open: menuBarOpen,
    onClose: closeMenuBar,
    onNewGraph: () => {
      closeMenuBar();
    }
  }), /* @__PURE__ */ React.createElement(Toolbar, {
    tasksSelected,
    onCreateTask,
    onComplete: () => {
    },
    onDelete: () => {
    }
  }), /* @__PURE__ */ React.createElement(GraphCanvas, null), insertMode && /* @__PURE__ */ React.createElement(NewTaskInput, {
    onNewTask: (name) => {
      addTask(name);
      setInsertMode(false);
    },
    onCancel: () => setInsertMode(false)
  }));
};
export default GraphPage;
