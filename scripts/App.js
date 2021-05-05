import React, {useRef} from "../snowpack/pkg/react.js";
import {closeMenubar} from "./index.js";
import GraphInput from "./GraphInput.js";
import {clearGraph, loadGraph} from "./graph.js";
import MenuBar from "./MenuBar.js";
import {saveToFile, saveToLocalStorage} from "./storage.js";
import useAppShortcuts from "./useAppShortcuts.js";
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
  useAppShortcuts(loadFromFile);
  return /* @__PURE__ */ React.createElement(React.Fragment, null, renderGraphInput(), renderMenuBar());
};
export default App;
