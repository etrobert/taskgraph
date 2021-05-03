"use strict";

import React from "react";
import ReactDOM from "react-dom";
import App from "./App.js";
import {
  initGraph,
  loadGraph,
  getGraph,
  addTask,
  deleteSelected,
  completeSelected,
} from "./graph.js";

import { getElementById } from "./misc.js";

function downloadFile(
  filename: string,
  text: string,
  type = "data:text/plain;charset=utf-8"
) {
  const element = document.createElement("a");
  element.setAttribute("href", `${type}, ${encodeURIComponent(text)}`);
  element.setAttribute("download", filename);

  element.style.display = "none";
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}

export function saveToLocalStorage(): void {
  const graph = getGraph();
  window.localStorage.setItem("graph", JSON.stringify(graph));
}

export function saveToFile(): void {
  const graph = getGraph();
  downloadFile(
    "graph.json",
    JSON.stringify(graph, null, 2),
    "data:text/json;charset=utf-8"
  );
}

function loadFromLocalStorage() {
  const graphItem = window.localStorage.getItem("graph");
  if (!graphItem) return;
  const graph = JSON.parse(graphItem);
  loadGraph(graph);
}

export function loadFromFile(): void {
  const fileInput = getElementById("fileInput");
  fileInput.click();
}

export const closeMenubar = (): void => {
  const menubar = getElementById("menubar");

  menubar.classList.remove("active");
};

const setupApp = () => {
  ReactDOM.render(<App />, document.getElementById("root"));

  const menubarButton = getElementById("menubarOpenButton");
  menubarButton.addEventListener("click", () => {
    const menubar = getElementById("menubar");

    menubar.classList.add("active");
  });
};

function setupToolbar() {
  const newTask = getElementById("newTask");
  getElementById("createTaskButton").onclick = () => {
    newTask.style.display = "block";
    newTask.focus();
  };

  getElementById("deleteTaskButton").addEventListener("click", () => {
    deleteSelected();
    saveToLocalStorage();
  });

  getElementById("completeTaskButton").addEventListener("click", () => {
    completeSelected();
    saveToLocalStorage();
  });
}

function updateToolbar(selection: boolean) {
  const createTaskButton = getElementById("createTaskButton");
  const deleteTaskButton = getElementById("deleteTaskButton");
  const completeTaskButton = getElementById("completeTaskButton");
  const linkModeCheckbox = getElementById("linkModeCheckbox");
  createTaskButton.style.display = !selection ? "block" : "none";
  deleteTaskButton.style.display = selection ? "block" : "none";
  completeTaskButton.style.display = selection ? "block" : "none";
  linkModeCheckbox.style.display = !selection ? "block" : "none";
}

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

function setupFileInput() {
  const fileInput = getElementById("fileInput") as HTMLInputElement;

  fileInput.onchange = () => {
    const files = fileInput.files;
    if (!files || files.length === 0) return;
    const file = files[0];
    if (file.type !== "application/json") return;
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      const result = reader.result as string;
      loadGraph(JSON.parse(result));
      saveToLocalStorage();
    });
    reader.readAsText(file);
    closeMenubar();
  };
}

document.addEventListener("DOMContentLoaded", () => {
  setupApp();
  setupToolbar();
  setupNewTask();
  setupFileInput();

  const graph = getElementById("graph");
  graph.addEventListener("taskmoved", saveToLocalStorage);
  graph.addEventListener("newdependency", saveToLocalStorage);
  graph.addEventListener("selectionchanged", function (event) {
    updateToolbar((event as CustomEvent<HTMLElement[]>).detail.length > 0);
  });

  initGraph();

  loadFromLocalStorage();
});
