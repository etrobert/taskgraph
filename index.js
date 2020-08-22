"use strict";

const container = document.body;

function removeFromArray(array, element) {
  array.splice(array.indexOf(element), 1);
}

function downloadFile(filename, text, type='data:text/plain;charset=utf-8') {
  var element = document.createElement('a');
  element.setAttribute('href',  `${type}, ${encodeURIComponent(text)}`);
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}

function addTask(name) {
  const task = document.createElement("div");
  task.classList.add("task");
  task.textContent = name;
  task.from = [];
  task.to = [];
  task.onclick = event => {
    if (!event.shiftKey)
      resetSelected();
    task.classList.add("selected");
    event.stopPropagation(); // Prevents the click on container to resetSelected
  };
  container.appendChild(task);
  return task;
}

function getSelected() {
  const isSelected = (e) => e.classList.contains("selected");
  return getTasks().filter(isSelected);
}

function resetSelected() {
  const selectedTasks = getSelected();
  selectedTasks.forEach(task => task.classList.remove("selected"));
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

function getTasks() {
  const isTask = (e) => e.classList.contains("task");
  return Array.from(container.children).filter(isTask);
}

function deleteDependency(dependency) {
  removeFromArray(dependency.from.from, dependency);
  removeFromArray(dependency.to.to, dependency);
  const arrows = document.getElementById("arrows");
  arrows.removeChild(dependency);
}

function deleteTask(task) {
  const from = task.from.slice();
  from.forEach(deleteDependency);
  const to = task.to.slice();
  to.forEach(deleteDependency);
  container.removeChild(task);
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

function getGraph() {
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

function loadGraph(graph) {
  clearGraph();
  graph.tasks.forEach((task) => {
    const htmlTask = addTask(task.name);
    htmlTask.style.left = task.pos.x + "px";
    htmlTask.style.top = task.pos.y + "px";
  });
  graph.dependencies.forEach(addDependency);
}

function loadFromLocalStorage() {
  const graphItem = window.localStorage.getItem("graph");
  if (!graphItem) return;
  const graph = JSON.parse(graphItem);
  loadGraph(graph);
}

function deleteSelected() {
  const selected = getSelected();
  selected.forEach(deleteTask)
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
};

document.addEventListener("DOMContentLoaded", (event) => {
  const newTask = document.getElementById("newTask");
  document.onkeyup = (event) => {
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
  }
  document.getElementById("deleteTaskButton").addEventListener("click", () => {
    deleteSelected();
    saveToLocalStorage();
  });

  document.getElementById("saveButton").addEventListener("click", saveToFile);

  newTask.onkeypress = (event) => {
    if (event.key == "Enter") {
      addTask(newTask.value);
      newTask.style.display = "none";
      newTask.value = "";
      saveToLocalStorage();
    }
  };

  const fileInput = document.getElementById("fileInput");
  fileInput.onchange = () => {
    const files = fileInput.files;
    if (files.length == 0)
      return;
    const file = files[0];
    if (file.type != "application/json")
      return;
    const reader  = new FileReader();
    reader.addEventListener("load", () => loadGraph(JSON.parse(reader.result)));
    reader.readAsText(file);
  }

  container.onclick = resetSelected;

  container.onpointerdown = event => {
    event.preventDefault();
    let moved = false;
    const task = event.target;
    if (!task.classList.contains("task")) return;
    if (event.shiftKey || document.querySelector("#linkModeCheckbox input").checked) {
      const pointerId = event.pointerId;
      // Initiate link creation
      const path = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "path"
      );
      path.from = task;
      arrows.appendChild(path);
      function onPointerMove(event) {
        if (event.pointerId !== pointerId) return;
        if (!moved) {
          container.setPointerCapture(pointerId);
          moved = true;
        }
        updatePath(path, { x: event.clientX, y: event.clientY });
      };
      function onPointerEnd(event) {
        if (event.pointerId !== pointerId) return;
        if (moved) container.releasePointerCapture(pointerId);
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
        saveToLocalStorage();
      };
      container.addEventListener("pointermove", onPointerMove);
      container.addEventListener("pointerup", onPointerEnd);
      container.addEventListener("pointercancel", onPointerEnd);
    } else {
      // Initiate Drag
      const pointerId = event.pointerId;
      const offsetX = event.offsetX;
      const offsetY = event.offsetY;
      function onPointerMove(event) {
        if (event.pointerId !== pointerId) return;
        if (!moved) {
          container.setPointerCapture(pointerId);
          moved = true;
        }
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
          container.releasePointerCapture(pointerId);
          saveToLocalStorage();
        }
      }
      container.addEventListener("pointermove", onPointerMove)
      container.addEventListener("pointerup", onPointerEnd);
      container.addEventListener("pointercancel", onPointerEnd);
    }
  };
  loadFromLocalStorage();
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
