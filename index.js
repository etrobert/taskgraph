"use strict";

const container = document.body;

function addTask(name) {
  const task = document.createElement("div");
  task.classList.add("task");
  task.textContent = name;
  task.from = [];
  task.to = [];
  container.appendChild(task);
}

document.addEventListener("DOMContentLoaded", (event) => {
  // updates the visual representation of path
  // if dest if specified, use instead of path.to
  const updatePath = (path, dest) => {
    const center = (element) => {
      const bb = element.getBoundingClientRect();
      return {
        x: parseFloat(bb.x) + parseFloat(bb.width) / 2,
        y: parseFloat(bb.y) + parseFloat(bb.height) / 2,
      };
    };
    const centerA = center(path.from);
    const centerB = dest ? dest : center(path.to);
    path.setAttributeNS(
      null,
      "d",
      `M${centerA.x},${centerA.y} L${centerB.x},${centerB.y}`
    );
  };

  // TEMPORARY HARDCODED LINK CODE
  const nodeA = document.getElementById("nodeA");
  nodeA.from = [];
  nodeA.to = [];

  const nodeB = document.getElementById("nodeB");
  nodeB.from = [];
  nodeB.to = [];

  const superPath = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "path"
  );

  const arrows = document.getElementById("arrows");
  superPath.from = nodeA;
  superPath.to = nodeB;

  nodeA.from.push(superPath);
  nodeB.to.push(superPath);
  arrows.appendChild(superPath);
  // TEMPORARY HARDCODED LINK CODE END

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

  container.onpointerdown = (event) => {
    event.preventDefault();
    const task = event.target;
    if (!task.classList.contains("task")) return;
    if (event.shiftKey) {
      // Initiate link creation
      const path = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "path"
      );
      path.from = task;
      arrows.appendChild(path);
      container.onpointermove = (event) => {
        updatePath(path, { x: event.clientX, y: event.clientY });
      };
      container.onpointerup = (event) => {
        container.onpointermove = null;
        container.onpointerup = null;
        const targetTask = event.target;
        // TODO Prevent a link to itself
        // TODO Prevent a link to a dependency
        // TODO Prevent a link to a target from which it's a dependency
        if (!targetTask.classList.contains("task")) {
          arrows.removeChild(path);
          return;
        }
        path.to = targetTask;
        task.from.push(path);
        targetTask.to.push(path);
        updatePath(path);
      };
    } else {
      // Initiate Drag
      container.setPointerCapture(event.pointerId);
      const offsetX = event.offsetX;
      const offsetY = event.offsetY;
      container.onpointermove = (event) => {
        task.style.left = event.clientX - offsetX + "px";
        task.style.top = event.clientY - offsetY + "px";
        for (let i = 0; i < task.from.length; i++) updatePath(task.from[i]);
        for (let i = 0; i < task.to.length; i++) updatePath(task.to[i]);
      };
      container.onpointerup = (event) => {
        container.onpointermove = null;
        container.onpointerup = null;
      };
    }
  };
});
