"use strict";

const container = document.body;

function addTask(name) {
  container.insertAdjacentHTML("beforeend", `<div class="task">${name}</div>`);
}

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
      addTask(newTask.value);
      newTask.style.display = "none";
      newTask.value = "";
    }
  };

  const task = document.getElementById("task");
  container.onpointerdown = (event) => {
    event.preventDefault();
    const task = event.target;
    if (!task.classList.contains("task")) return;
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
