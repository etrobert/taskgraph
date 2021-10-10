import React, {useState} from "../../../_snowpack/pkg/react.js";
import useAppShortcuts from "../App/useAppShortcuts.js";
import MenuBar from "../MenuBar/MenuBar.js";
import Toolbar from "../Toolbar/Toolbar.js";
import GraphCanvas from "../GraphCanvas/GraphCanvas.js";
import NewTaskInput from "../NewTaskInput/NewTaskInput.js";
import useFirestoreState from "../../hooks/useFirestoreState.js";
import useSyncFirestore from "../../hooks/useSyncFirestore.js";
import "./GraphPage.css.proxy.js";
const GraphPage = () => {
  const [menuBarOpen, setMenuBarOpen] = useState(false);
  const closeMenuBar = () => setMenuBarOpen(false);
  const [insertMode, setInsertMode] = useState(false);
  const onCreateTask = () => setInsertMode(true);
  const {addTask, deleteSelected} = useFirestoreState();
  useSyncFirestore();
  useAppShortcuts({
    insertMode,
    onDelete: deleteSelected,
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
    onCreateTask,
    onComplete: () => {
    },
    onDelete: deleteSelected
  }), /* @__PURE__ */ React.createElement(GraphCanvas, null), insertMode && /* @__PURE__ */ React.createElement(NewTaskInput, {
    onNewTask: (name) => {
      addTask(name);
      setInsertMode(false);
    },
    onCancel: () => setInsertMode(false)
  }));
};
export default GraphPage;
