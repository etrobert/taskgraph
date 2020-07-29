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
    const nodeABox = path.from.getBoundingClientRect();
    const nodeBBox = dest ? null : path.to.getBoundingClientRect();

    const centerA = getBoxCenter(nodeABox);
    const centerB = dest ? dest : getBoxCenter(nodeBBox);

    const pathPointA = intersectLineBox(centerA, centerB, getExpandedBox(nodeABox, 8));
    const pathPointB = dest ? dest : intersectLineBox(centerA, centerB, getExpandedBox(nodeBBox, 8));

    if (pathPointA && pathPointB) {
      path.setAttributeNS(
        null,
        "d",
        `M${pathPointA.x},${pathPointA.y} L${pathPointB.x},${pathPointB.y}`
      );
    } else {
      path.setAttributeNS(null, "d", "");
    }
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

function getBoxCenter(box) {
  return {
    x: box.left + (box.width / 2),
    y: box.top + (box.height / 2),
  }
}

function getExpandedBox(box, offset) {
  return {
    left: box.left - offset,
    top: box.top - offset,
    right: box.right + offset,
    bottom: box.bottom + offset,
  }
}

// Finds the intersection point between the line segment p1->p2 and the given bounding box.
// If the line segment and the box don't intersect, null is returned.
function intersectLineBox(p1, p2, box) {
  const left = {
    p1: {x: box.left, y: box.top},
    p2: {x: box.left, y: box.bottom},
  };
  const top = {
    p1: {x: box.left,  y: box.top},
    p2: {x: box.right, y: box.top},
  };
  const right = {
    p1: {x: box.right, y: box.top},
    p2: {x: box.right, y: box.bottom},
  };
  const bottom = {
    p1: {x: box.left,  y: box.bottom},
    p2: {x: box.right, y: box.bottom},
  };

  return intersectLines(p1, p2, left.p1, left.p2) ||
         intersectLines(p1, p2, top.p1, top.p2) ||
         intersectLines(p1, p2, right.p1, right.p2) ||
         intersectLines(p1, p2, bottom.p1, bottom.p2);
}

// Finds the intersection point between the line segments p1->p2 and p3->p4.
// If the segments don't intersect, null is returned.
function intersectLines(p1, p2, p3, p4) {

  // Check if none of the lines are of length 0
  if ((p1.x === p2.x && p1.y === p2.y) || (p3.x === p4.x && p3.y === p4.y)) {
    return null
  }

  const denominator = ((p4.y - p3.y) * (p2.x - p1.x) - (p4.x - p3.x) * (p2.y - p1.y))

  // Lines are parallel
  if (denominator === 0) {
    return null
  }

  let ua = ((p4.x - p3.x) * (p1.y - p3.y) - (p4.y - p3.y) * (p1.x - p3.x)) / denominator
  let ub = ((p2.x - p1.x) * (p1.y - p3.y) - (p2.y - p1.y) * (p1.x - p3.x)) / denominator

  // is the intersection along the segments
  if (ua < 0 || ua > 1 || ub < 0 || ub > 1) {
    return null
  }

  // Return a object with the x and y coordinates of the intersection
  let x = p1.x + ua * (p2.x - p1.x)
  let y = p1.y + ua * (p2.y - p1.y)

  return {x, y}
}
