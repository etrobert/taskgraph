import React from "react";
import { closeMenubar, loadFromFile, saveToFile } from ".";
import { clearGraph } from "./graph";
import MenuBar from "./MenuBar";
import { getElementById } from "./misc";

import "./App.css";

const App = (): JSX.Element => {
  const onSave = () => {
    saveToFile();
    closeMenubar();
  };

  const onNewGraph = () => {
    clearGraph();
    closeMenubar();
  };

  const onMenubarOpenButtonClick = () => {
    const menubarButton = getElementById("menubar");
    menubarButton.classList.add("active");
  };

  return (
    <>
      <button
        className="App__menubar-open-button iconButton"
        onClick={onMenubarOpenButtonClick}
      />

      <MenuBar
        onClose={closeMenubar}
        onLoad={loadFromFile}
        onNewGraph={onNewGraph}
        onSave={onSave}
      />
    </>
  );
};

export default App;
