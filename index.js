"use strict";

import {
  initGraph,
  loadGraph,
  getGraph,
  addTask,
  deleteSelected,
  onTaskMoved,
  onNewDependency,
  clearGraph,
} from "./graph.js";

onTaskMoved(saveToLocalStorage);
onNewDependency(saveToLocalStorage);

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

const stopNewTask = () => {
  newTask.style.display = "none";
  newTask.value = "";
};

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

  const menubarLoadButton = document.getElementById("menubarLoadButton");
  menubarLoadButton.addEventListener("click", () => {
    console.log("Load");
  });

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

document.addEventListener("DOMContentLoaded", (event) => {
  setupMenubar();
  const newTask = document.getElementById("newTask");
  document.onkeyup = (event) => {
    // Do not register commands when adding new task
    if (newTask.style.display !== "none") return;
    if (event.key == "i") {
      newTask.style.display = "block";
      newTask.focus();
    } else if (event.key == "d" || event.key == "Delete") {
      deleteSelected();
      saveToLocalStorage();
    } else if (event.key == "s") {
      saveToFile();
    }
  };
  document.getElementById("createTaskButton").onclick = () => {
    newTask.style.display = "block";
    newTask.focus();
  };
  document.getElementById("deleteTaskButton").addEventListener("click", () => {
    deleteSelected();
    saveToLocalStorage();
  });

  newTask.onblur = stopNewTask;

  newTask.onkeypress = (event) => {
    if (event.key == "Enter") {
      addTask(newTask.value);
      stopNewTask();
      saveToLocalStorage();
    }
  };

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
  };

  initGraph();

  loadFromLocalStorage();
});
