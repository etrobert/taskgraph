import React from "react";
import ReactDOM from "react-dom";

import App from "./App/App";
import { addTask } from "./graph.js";
import { getElementById } from "./misc.js";
import { loadFromLocalStorage, saveToLocalStorage } from "./storage.js";

const setupApp = () => {
  ReactDOM.render(<App />, document.getElementById("root"));
};

function setupNewTask() {
  const newTask = getElementById("newTask") as HTMLInputElement;
  const stopNewTask = () => {
    newTask.style.display = "none";
    newTask.value = "";
  };

  newTask.onblur = stopNewTask;

  newTask.onkeypress = (event) => {
    if (event.key === "Enter") {
      if (newTask.value) {
        addTask({ name: newTask.value });
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

  loadFromLocalStorage();
});
