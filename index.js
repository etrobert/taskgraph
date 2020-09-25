"use strict";

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

function downloadFile(filename, text, type = "data:text/plain;charset=utf-8") {
  var element = document.createElement("a");
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
  fileInput.click();
}

function setupMenubar() {
  const menubar = document.getElementById("menubar");

  const closeMenubar = () => {
    menubar.classList.remove("active");
  };

  const menubarButton = document.getElementById("menubarOpenButton");
  menubarButton.addEventListener("click", () => {
    menubar.classList.add("active");
  });

  const menubarCloseButton = document.getElementById("menubarCloseButton");
  menubarCloseButton.addEventListener("click", closeMenubar);

  const fileInput = document.getElementById("fileInput");
  fileInput.onchange = () => {
    const files = fileInput.files;
    if (files.length == 0) return;
    const file = files[0];
    if (file.type != "application/json") return;
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      loadGraph(JSON.parse(reader.result));
      saveToLocalStorage();
    });
    reader.readAsText(file);
    closeMenubar();
  };

  const menubarLoadButton = document.getElementById("menubarLoadButton");
  menubarLoadButton.addEventListener("click", loadFromFile);

  const menubarSaveButton = document.getElementById("menubarSaveButton");
  menubarSaveButton.addEventListener("click", () => {
    saveToFile();
    closeMenubar();
  });

  const menubarNewGraphButton = document.getElementById(
    "menubarNewGraphButton"
  );
  menubarNewGraphButton.addEventListener("click", () => {
    clearGraph();
    closeMenubar();
  });
}

function setupToolbar() {
  document.getElementById("createTaskButton").onclick = () => {
    newTask.style.display = "block";
    newTask.focus();
  };

  document.getElementById("deleteTaskButton").addEventListener("click", () => {
    deleteSelected();
    saveToLocalStorage();
  });

  document
    .getElementById("completeTaskButton")
    .addEventListener("click", () => {
      completeSelected();
      saveToLocalStorage();
    });
}

function updateToolbar(selection) {
  const createTaskButton = document.getElementById("createTaskButton");
  const deleteTaskButton = document.getElementById("deleteTaskButton");
  const completeTaskButton = document.getElementById("completeTaskButton");
  const linkModeCheckbox = document.getElementById("linkModeCheckbox");
  createTaskButton.style.display = !selection ? "block" : "none";
  deleteTaskButton.style.display = selection ? "block" : "none";
  completeTaskButton.style.display = selection ? "block" : "none";
  linkModeCheckbox.style.display = !selection ? "block" : "none";
}

function setupNewTask() {
  const stopNewTask = () => {
    newTask.style.display = "none";
    newTask.value = "";
  };

  const newTask = document.getElementById("newTask");

  newTask.onblur = stopNewTask;

  newTask.onkeypress = (event) => {
    if (event.key == "Enter") {
      if (newTask.value) {
        addTask({ name: newTask.value });
        saveToLocalStorage();
      }
      stopNewTask();
    }
  };
}

document.addEventListener("DOMContentLoaded", (event) => {
  setupMenubar();
  setupToolbar();
  setupNewTask();

  const graph = document.getElementById("graph");
  graph.addEventListener("taskmoved", saveToLocalStorage);
  graph.addEventListener("newdependency", saveToLocalStorage);
  graph.addEventListener("selectionchanged", (event) => {
    updateToolbar(event.detail.length > 0);
  });

  const newTask = document.getElementById("newTask");
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
