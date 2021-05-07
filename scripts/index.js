"use strict";
import React from "../snowpack/pkg/react.js";
import ReactDOM from "../snowpack/pkg/react-dom.js";
import App from "./App.js";
import {initGraph, addTask} from "./graph.js";
import {getElementById} from "./misc.js";
import {loadFromLocalStorage, saveToLocalStorage} from "./storage.js";
export const closeMenubar = () => {
  const menubar = getElementById("menubar");
  menubar.classList.remove("active");
};
const setupApp = () => {
  ReactDOM.render(/* @__PURE__ */ React.createElement(App, null), document.getElementById("root"));
  const menubarButton = getElementById("menubarOpenButton");
  menubarButton.addEventListener("click", () => {
    const menubar = getElementById("menubar");
    menubar.classList.add("active");
  });
};
function setupNewTask() {
  const newTask = getElementById("newTask");
  const stopNewTask = () => {
    newTask.style.display = "none";
    newTask.value = "";
  };
  newTask.onblur = stopNewTask;
  newTask.onkeypress = (event) => {
    if (event.key === "Enter") {
      if (newTask.value) {
        addTask({name: newTask.value});
        saveToLocalStorage();
      }
      stopNewTask();
    }
  };
}
document.addEventListener("DOMContentLoaded", () => {
  setupApp();
  setupNewTask();
  const graph = getElementById("graph");
  graph.addEventListener("taskmoved", saveToLocalStorage);
  graph.addEventListener("newdependency", saveToLocalStorage);
  initGraph();
  loadFromLocalStorage();
});
