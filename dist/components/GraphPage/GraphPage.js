import React, {useState} from "../../../_snowpack/pkg/react.js";
import {Redirect} from "../../../_snowpack/pkg/react-router.js";
import {useRecoilState, useRecoilValue} from "../../../_snowpack/pkg/recoil.js";
import useAppShortcuts from "../App/useAppShortcuts.js";
import MenuBar from "../MenuBar/MenuBar.js";
import PropertiesPanel from "../PropertiesPanel/PropertiesPanel.js";
import GraphCanvas from "../GraphCanvas/GraphCanvas.js";
import NewTaskInput from "../NewTaskInput/NewTaskInput.js";
import useFirestoreState from "../../hooks/useFirestoreState.js";
import {authState, insertModeState} from "../../atoms.js";
import "./GraphPage.css.proxy.js";
const GraphPage = () => {
  const [menuBarOpen, setMenuBarOpen] = useState(false);
  const closeMenuBar = () => setMenuBarOpen(false);
  const [insertMode, setInsertMode] = useRecoilState(insertModeState);
  const {addTask} = useFirestoreState();
  useAppShortcuts();
  const auth = useRecoilValue(authState);
  if (auth.status === "notSignedIn")
    return /* @__PURE__ */ React.createElement(Redirect, {
      to: "/"
    });
  return /* @__PURE__ */ React.createElement("div", {
    className: "GraphPage"
  }, /* @__PURE__ */ React.createElement("button", {
    className: "GraphPage__menu-bar-open-button iconButton",
    onClick: () => setMenuBarOpen(true)
  }), /* @__PURE__ */ React.createElement(MenuBar, {
    open: menuBarOpen,
    onClose: closeMenuBar
  }), /* @__PURE__ */ React.createElement(GraphCanvas, null), insertMode && /* @__PURE__ */ React.createElement(NewTaskInput, {
    onNewTask: (name) => {
      addTask(name);
      setInsertMode(false);
    },
    onCancel: () => setInsertMode(false)
  }), /* @__PURE__ */ React.createElement(PropertiesPanel, null));
};
export default GraphPage;
