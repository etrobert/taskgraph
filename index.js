"use strict";

document.addEventListener("DOMContentLoaded", (event) => {
  const newTask = document.getElementById("newTask");
  document.onkeyup = (event) => {
    if (event.key == "i") {
      newTask.style.display = "block";
      newTask.focus();
    }
  };
  newTask.onkeypress = (event) => {
    if (event.key == "Enter") {
      console.log("New task: " + newTask.value);
      newTask.style.display = "none";
      newTask.value = "";
    }
  };

  const task = document.getElementById("task");
  const container = document.body;
  task.onpointerdown = (event) => {
    event.preventDefault();
    container.setPointerCapture(event.pointerId);
    const offsetX = event.offsetX;
    const offsetY = event.offsetY;
    container.onpointermove = (event) => {
      task.style.left = event.clientX - offsetX + "px";
      task.style.top = event.clientY - offsetY + "px";
    };
    container.onpointerup = (event) => {
      container.onpointermove = null;
      container.onpointerup = null;
    };
  };
});
