import React from "react";
import ReactDOM from "react-dom";

import App from "./App/App";
import { getElementById } from "./misc.js";
import { loadFromLocalStorage, saveToLocalStorage } from "./storage.js";

const setupApp = () => {
  ReactDOM.render(<App />, document.getElementById("root"));
};

document.addEventListener("DOMContentLoaded", () => {
  setupApp();

  const graph = getElementById("graph");
  graph.addEventListener("taskmoved", saveToLocalStorage);

  loadFromLocalStorage();
});
