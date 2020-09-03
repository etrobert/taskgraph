"use strict";

const container = document.body;

function getTasks() {
  const isTask = (e) => e.classList.contains("task");
  return Array.from(container.children).filter(isTask);
}

function getDependencies() {
  const isDependency = (e) => e.tagName == "path";
  return Array.from(arrows.children).filter(isDependency);
}

function clearGraph() {
  const removeElement = (e) => e.parentNode.removeChild(e);
  const tasks = getTasks();
  tasks.forEach(removeElement);
  const dependencies = getDependencies();
  dependencies.forEach(removeElement);
}

export function addTask(name) {
  const task = document.createElement("div");
  task.classList.add("task");
  task.textContent = name;
  task.from = [];
  task.to = [];
  container.appendChild(task);
  return task;
}

function addDependency(dependency) {
  const dependencyHtml = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "path"
  );
  const tasks = getTasks();
  const predecessor = tasks.find(
    (task) => task.textContent == dependency.predecessor
  );
  if (!predecessor) {
    console.error(
      "Could not add dependency: predecessor not found",
      dependency
    );
    return;
  }
  const successor = tasks.find(
    (task) => task.textContent == dependency.successor
  );
  if (!successor) {
    console.error("Could not add dependency: successor not found.", dependency);
    return;
  }
  dependencyHtml.from = predecessor;
  dependencyHtml.to = successor;

  predecessor.from.push(dependencyHtml);
  successor.to.push(dependencyHtml);

  const arrows = document.getElementById("arrows");
  arrows.appendChild(dependencyHtml);

  updatePath(dependencyHtml);
}

function deleteTask(task) {
  const from = task.from.slice();
  from.forEach(deleteDependency);
  const to = task.to.slice();
  to.forEach(deleteDependency);
  container.removeChild(task);
}

function removeFromArray(array, element) {
  array.splice(array.indexOf(element), 1);
}

function deleteDependency(dependency) {
  removeFromArray(dependency.from.from, dependency);
  removeFromArray(dependency.to.to, dependency);
  const arrows = document.getElementById("arrows");
  arrows.removeChild(dependency);
}

export function deleteSelected() {
  const selected = getSelected();
  selected.forEach(deleteTask)
}

function onTaskClicked(task, event) {
  if (!event.shiftKey) resetSelected();
  task.classList.add("selected");
}

function getSelected() {
  const isSelected = (e) => e.classList.contains("selected");
  return getTasks().filter(isSelected);
}

function resetSelected() {
  const selectedTasks = getSelected();
  selectedTasks.forEach(task => task.classList.remove("selected"));
}

export function loadGraph(graph) {
  clearGraph();
  graph.tasks.forEach((task) => {
    const htmlTask = addTask(task.name);
    htmlTask.style.left = task.pos.x + "px";
    htmlTask.style.top = task.pos.y + "px";
  });
  graph.dependencies.forEach(addDependency);
}

export function getGraph() {
  const tasksHtml = getTasks();
  const tasks = tasksHtml.map((e) => {
    const bb = e.getBoundingClientRect();
    return {
      name: e.textContent,
      pos: { x: bb.left, y: bb.top },
    };
  });
  const dependenciesHtml = getDependencies();
  const dependencies = dependenciesHtml.map((e) => ({
    predecessor: e.from.textContent,
    successor: e.to.textContent,
  }));
  return { tasks, dependencies };
}

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

// updates the visual representation of path
// if dest if specified, use instead of path.to
function updatePath(path, dest) {
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
}

export function initGraph() {
  container.onpointerdown = event => {
    event.preventDefault();
    let moved = false;
    const task = event.target;
    if (!task.classList.contains("task")) {
      resetSelected();
      return;
    }
    const pointerId = event.pointerId;
    container.setPointerCapture(pointerId);
    if (event.shiftKey || document.querySelector("#linkModeCheckbox input").checked) {
      // Initiate link creation
      const path = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "path"
      );
      path.from = task;
      arrows.appendChild(path);
      function onPointerMove(event) {
        if (event.pointerId !== pointerId) return;
        moved = true;
        updatePath(path, { x: event.clientX, y: event.clientY });
      };
      function onPointerEnd(event) {
        if (event.pointerId !== pointerId) return;
        if (!moved)
          onTaskClicked(task, event);
        container.removeEventListener("pointermove", onPointerMove);
        container.removeEventListener("pointerup", onPointerEnd);
        container.removeEventListener("pointercancel", onPointerEnd);
        const target = document.elementFromPoint(event.pageX, event.pageY);
        // TODO Prevent a link to itself
        // TODO Prevent a link to a dependency
        // TODO Prevent a link to a target from which it's a dependency
        if (!target || !target.classList.contains("task")) {
          arrows.removeChild(path);
          return;
        }
        path.to = target;
        task.from.push(path);
        target.to.push(path);
        updatePath(path);
        if (onnewdependency) onnewdependency();
      };
      container.addEventListener("pointermove", onPointerMove);
      container.addEventListener("pointerup", onPointerEnd);
      container.addEventListener("pointercancel", onPointerEnd);
    } else {
      // Initiate Drag
      const offsetX = event.offsetX;
      const offsetY = event.offsetY;
      function onPointerMove(event) {
        if (event.pointerId !== pointerId) return;
        moved = true;
        task.style.left = event.clientX - offsetX + "px";
        task.style.top = event.clientY - offsetY + "px";
        for (const path of [...task.from, ...task.to]) updatePath(path);
      }
      function onPointerEnd(event) {
        if (event.pointerId !== pointerId) return;
        container.removeEventListener("pointermove", onPointerMove);
        container.removeEventListener("pointerup", onPointerEnd);
        container.removeEventListener("pointercancel", onPointerEnd);
        if (moved) {
          if (ontaskmoved) ontaskmoved();
        }
        else
          onTaskClicked(task, event);
      }
      container.addEventListener("pointermove", onPointerMove)
      container.addEventListener("pointerup", onPointerEnd);
      container.addEventListener("pointercancel", onPointerEnd);
    }
  };
}

let ontaskmoved = null;
export function onTaskMoved(f) {
  ontaskmoved = f;
}

let onnewdependency = null;
export function onNewDependency(f) {
  onnewdependency = f;
}
