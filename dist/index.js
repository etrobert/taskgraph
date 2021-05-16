import React from "../snowpack/pkg/react.js";
import ReactDOM from "../snowpack/pkg/react-dom.js";
import App from "./App/App.js";
import {getElementById} from "./misc.js";
import {loadFromLocalStorage, saveToLocalStorage} from "./storage.js";
const setupApp = () => {
  ReactDOM.render(/* @__PURE__ */ React.createElement(App, null), document.getElementById("root"));
};
document.addEventListener("DOMContentLoaded", () => {
  setupApp();
  const graph = getElementById("graph");
  graph.addEventListener("taskmoved", saveToLocalStorage);
  graph.addEventListener("newdependency", saveToLocalStorage);
  loadFromLocalStorage();
});
