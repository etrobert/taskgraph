import React from "../snowpack/pkg/react.js";
import {closeMenubar, loadFromFile, saveToFile} from "./index.js";
import {clearGraph} from "./graph.js";
import MenuBar from "./MenuBar.js";
const App = () => {
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
export default App;
