"use strict";

import React from "react";
import ReactDOM from "react-dom";
import {
  initGraph,
  loadGraph,
  getGraph,
  addTask,
  deleteSelected,
  clearGraph,
  completeSelected,
  selectAll,
} from "./graph.js";
import MenuBar from "./MenuBar.js";

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

function saveToLocalStorage() {
  const graph = getGraph();
  window.localStorage.setItem("graph", JSON.stringify(graph));
}

function saveToFile() {
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

function loadFromFile() {
  const fileInput = getElementById("fileInput");
  fileInput.click();
}

const closeMenubar = () => {
  const menubar = getElementById("menubar");

  menubar.classList.remove("active");
};

function setupMenubar() {
  const onSave = () => {
    saveToFile();
    closeMenubar();
  };

  const onNewGraph = () => {
    clearGraph();
    closeMenubar();
  };

  ReactDOM.render(
    <MenuBar
      onClose={closeMenubar}
      onLoad={loadFromFile}
      onNewGraph={onNewGraph}
      onSave={onSave}
    />,
    document.getElementById("menuBarRoot")
  );

  const menubar = getElementById("menubar");

  const menubarButton = getElementById("menubarOpenButton");
  menubarButton.addEventListener("click", () => {
    menubar.classList.add("active");
  });
}

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
  setupMenubar();
  setupToolbar();
  setupNewTask();
  setupFileInput();

  const graph = getElementById("graph");
  graph.addEventListener("taskmoved", saveToLocalStorage);
  graph.addEventListener("newdependency", saveToLocalStorage);
  graph.addEventListener("selectionchanged", function (event) {
    updateToolbar((event as CustomEvent<HTMLElement[]>).detail.length > 0);
  });

  const newTask = getElementById("newTask");
  document.onkeyup = (event) => {
    // Do not register commands when adding new task
    if (newTask.style.display === "block") return;
    switch (event.key) {
      case "a":
        if (event.ctrlKey) selectAll();
        break;
      case "i":
        newTask.style.display = "block";
        newTask.focus();
        break;
      case "d":
      case "Delete":
        deleteSelected();
        saveToLocalStorage();
        break;
      case "o":
        if (event.ctrlKey) loadFromFile();
        break;
      case "s":
        if (event.ctrlKey) saveToFile();
        break;
    }
  };

  initGraph();

  loadFromLocalStorage();
});
