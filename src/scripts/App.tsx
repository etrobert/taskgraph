import React from "react";
import { closeMenubar, loadFromFile } from ".";
import { clearGraph } from "./graph";
import MenuBar from "./MenuBar";
import { saveToFile } from "./storage";
import useAppShortcuts from "./useAppShortcuts";

const App = (): JSX.Element => {
  useAppShortcuts();

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
