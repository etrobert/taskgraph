import React from "react";
import { closeMenubar, loadFromFile, saveToFile } from ".";
import { clearGraph } from "./graph";
import MenuBar from "./MenuBar";

const App = (): JSX.Element => {
  const onSave = () => {
    saveToFile();
    closeMenubar();
  };

  const onNewGraph = () => {
    clearGraph();
    closeMenubar();
  };

  return (
    <MenuBar
      onClose={closeMenubar}
      onLoad={loadFromFile}
      onNewGraph={onNewGraph}
      onSave={onSave}
    />
  );
};

export default App;
