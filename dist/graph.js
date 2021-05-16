import {
  squaredDistance,
  getBoxCenter,
  getExpandedBox,
  getOffsetBox,
  intersectLineBox
} from "./geometry.js";
import {getElementById, removeFromArray} from "./misc.js";
function getTasks() {
  const isTask = (e) => e.classList.contains("task");
  const itemsContainer = getElementById("itemsContainer");
  const elements = Array.from(itemsContainer.children);
  return elements.filter(isTask);
}
function getDependencies() {
  const isDependency = (e) => e.tagName === "path";
  const arrows = getElementById("arrows");
  const elements = Array.from(arrows.children);
  return elements.filter(isDependency);
}
export function clearGraph() {
  const removeElement = (e) => {
    if (e.parentNode)
      e.parentNode.removeChild(e);
  };
  const tasks = getTasks();
  tasks.forEach(removeElement);
  const dependencies = getDependencies();
  dependencies.forEach(removeElement);
}
function getViewCenter() {
  const graphContainer = getElementById("graph");
  const box = getOffsetBox(graphContainer);
  const viewCenter = getBoxCenter(box);
  const {pan} = getPanZoom();
  return {
    x: viewCenter.x - pan.x,
    y: viewCenter.y - pan.y
  };
}
function computeCenteredPos(element) {
  const viewCenter = getViewCenter();
  const width = element.offsetWidth;
  const height = element.offsetHeight;
  return {
    x: viewCenter.x - width / 2,
    y: viewCenter.y - height / 2
  };
}
export function addTask(task) {
  const htmlTask = document.createElement("div");
  htmlTask.classList.add("task");
  htmlTask.textContent = task.name;
  htmlTask.from = [];
  htmlTask.to = [];
  if (task.status === "completed")
    htmlTask.classList.add("completed");
  const itemsContainer = getElementById("itemsContainer");
  itemsContainer.appendChild(htmlTask);
  const pos = task.pos ? task.pos : computeCenteredPos(htmlTask);
  htmlTask.style.left = pos.x + "px";
  htmlTask.style.top = pos.y + "px";
  return htmlTask;
}
function addDependency(dependency) {
  const dependencyHtml = document.createElementNS("http://www.w3.org/2000/svg", "path");
  const tasks = getTasks();
  const predecessor = tasks.find((task) => task.textContent === dependency.predecessor);
  if (!predecessor) {
    console.error("Could not add dependency: predecessor not found", dependency);
    return;
  }
  const successor = tasks.find((task) => task.textContent === dependency.successor);
  if (!successor) {
    console.error("Could not add dependency: successor not found.", dependency);
    return;
  }
  dependencyHtml.from = predecessor;
  dependencyHtml.to = successor;
  predecessor.from.push(dependencyHtml);
  successor.to.push(dependencyHtml);
  const arrows = getElementById("arrows");
  arrows.appendChild(dependencyHtml);
  updatePath(dependencyHtml);
}
function deleteTask(task) {
  const from = task.from.slice();
  from.forEach(deleteDependency);
  const to = task.to.slice();
  to.forEach(deleteDependency);
  const itemsContainer = getElementById("itemsContainer");
  itemsContainer.removeChild(task);
}
function deleteDependency(dependency) {
  removeFromArray(dependency.from.from, dependency);
  removeFromArray(dependency.to.to, dependency);
  const arrows = getElementById("arrows");
  arrows.removeChild(dependency);
}
export function selectAll() {
  const tasks = getTasks();
  tasks.forEach((t) => t.classList.add("selected"));
  sendSelectionChanged(tasks);
}
export function deleteSelected() {
  const selected = getSelected();
  selected.forEach(deleteTask);
  sendSelectionChanged([]);
}
export function completeSelected() {
  const selected = getSelected();
  selected.forEach((task) => task.classList.toggle("completed"));
}
function onTaskClicked(task, event) {
  if (event.shiftKey) {
    task.classList.toggle("selected");
    sendSelectionChanged();
  } else {
    resetSelected();
    task.classList.add("selected");
    sendSelectionChanged([task]);
  }
}
function sendSelectionChanged(selection) {
  const graphContainer = getElementById("graph");
  graphContainer.dispatchEvent(new CustomEvent("selectionchanged", {
    detail: selection ? selection : getSelected()
  }));
}
function getSelected() {
  const isSelected = (e) => e.classList.contains("selected");
  return getTasks().filter(isSelected);
}
function resetSelected() {
  const selectedTasks = getSelected();
  selectedTasks.forEach((task) => task.classList.remove("selected"));
}
export function loadGraph(graph) {
  clearGraph();
  graph.tasks.forEach(addTask);
  graph.dependencies.forEach(addDependency);
}
export function getGraph() {
  const tasksHtml = getTasks();
  const tasks = tasksHtml.map((e) => {
    const bb = getOffsetBox(e);
    return {
      name: e.textContent,
      pos: {x: bb.left, y: bb.top},
      status: e.classList.contains("completed") ? "completed" : "todo"
    };
  });
  const dependenciesHtml = getDependencies();
  const dependencies = dependenciesHtml.map((e) => ({
    predecessor: e.from.textContent,
    successor: e.to.textContent
  }));
  return {tasks, dependencies};
}
function updatePath(path, dest) {
  const nodeABox = getOffsetBox(path.from);
  const nodeBBox = dest ? null : getOffsetBox(path.to);
  const centerA = getBoxCenter(nodeABox);
  const centerB = dest ? dest : getBoxCenter(nodeBBox);
  const offset = 8;
  const pathPointA = intersectLineBox(centerA, centerB, getExpandedBox(nodeABox, offset));
  const pathPointB = dest ? dest : intersectLineBox(centerA, centerB, getExpandedBox(nodeBBox, offset));
  if (pathPointA && pathPointB) {
    path.setAttributeNS(null, "d", `M${pathPointA.x},${pathPointA.y} L${pathPointB.x},${pathPointB.y}`);
  } else {
    path.setAttributeNS(null, "d", "");
  }
}
const getPanZoom = () => {
  const graph = getElementById("graph");
  const {panX, panY, zoom} = graph.dataset;
  if (panX === void 0 || panY === void 0 || zoom === void 0)
    throw new Error("pan or zoom values missing");
  return {
    pan: {
      x: parseFloat(panX),
      y: parseFloat(panY)
    },
    zoom: parseFloat(zoom)
  };
};
function onGraphDragStart(event) {
  const itemsContainer = getElementById("itemsContainer");
  itemsContainer.setPointerCapture(event.pointerId);
  let previousPosition = {x: event.clientX, y: event.clientY};
  const onPointerMove = (event2) => {
    const {pan} = getPanZoom();
    const x = pan.x + event2.clientX - previousPosition.x;
    const y = pan.y + event2.clientY - previousPosition.y;
    previousPosition = {x: event2.clientX, y: event2.clientY};
    const graphContainer = getElementById("graph");
    graphContainer.dispatchEvent(new CustomEvent("graphmoved", {detail: {pan: {x, y}}}));
  };
  const onPointerEnd = () => {
    const itemsContainer2 = getElementById("itemsContainer");
    itemsContainer2.removeEventListener("pointermove", onPointerMove);
    itemsContainer2.removeEventListener("pointerup", onPointerEnd);
  };
  itemsContainer.addEventListener("pointermove", onPointerMove);
  itemsContainer.addEventListener("pointerup", onPointerEnd);
}
function moveTask(task, pos) {
  task.style.left = pos.x + "px";
  task.style.top = pos.y + "px";
  for (const path of [...task.from, ...task.to])
    updatePath(path);
}
export function initGraph() {
  const graphContainer = getElementById("graph");
  graphContainer.onpointerdown = (event) => {
    event.preventDefault();
    let moved = false;
    const target = event.target;
    if (!target || !target.classList.contains("task")) {
      resetSelected();
      sendSelectionChanged([]);
      onGraphDragStart(event);
      return;
    }
    const task = target;
    const pointerId = event.pointerId;
    const itemsContainer = getElementById("itemsContainer");
    itemsContainer.setPointerCapture(pointerId);
    const initialPosition = {x: event.clientX, y: event.clientY};
    const linkModeCheckbox = getElementById("linkModeCheckbox");
    if (event.shiftKey || linkModeCheckbox.checked) {
      const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
      path.from = task;
      const arrows = getElementById("arrows");
      arrows.appendChild(path);
      const onPointerMove = (event2) => {
        if (event2.pointerId !== pointerId)
          return;
        moved = true;
        updatePath(path, {x: event2.offsetX, y: event2.offsetY});
      };
      const onPointerEnd = (event2) => {
        if (event2.pointerId !== pointerId)
          return;
        if (!moved)
          onTaskClicked(task, event2);
        const itemsContainer3 = getElementById("itemsContainer");
        itemsContainer3.removeEventListener("pointermove", onPointerMove);
        itemsContainer3.removeEventListener("pointerup", onPointerEnd);
        itemsContainer3.removeEventListener("pointercancel", onPointerEnd);
        const target2 = document.elementFromPoint(event2.pageX, event2.pageY);
        if (!target2 || !target2.classList.contains("task")) {
          const arrows2 = getElementById("arrows");
          arrows2.removeChild(path);
          return;
        }
        const targetTask = target2;
        path.to = targetTask;
        task.from.push(path);
        targetTask.to.push(path);
        updatePath(path);
        const graphContainer2 = getElementById("graph");
        graphContainer2.dispatchEvent(new CustomEvent("newdependency"));
      };
      const itemsContainer2 = getElementById("itemsContainer");
      itemsContainer2.addEventListener("pointermove", onPointerMove);
      itemsContainer2.addEventListener("pointerup", onPointerEnd);
      itemsContainer2.addEventListener("pointercancel", onPointerEnd);
    } else {
      const offsetX = event.offsetX;
      const offsetY = event.offsetY;
      task.classList.add("dragged");
      const onPointerMove = (event2) => {
        if (event2.pointerId !== pointerId)
          return;
        const currentPosition = {x: event2.clientX, y: event2.clientY};
        const movedThreshold = 5;
        const squaredMovedThreshold = movedThreshold * movedThreshold;
        if (squaredDistance(initialPosition, currentPosition) > squaredMovedThreshold)
          moved = true;
        moveTask(task, {
          x: event2.offsetX - offsetX,
          y: event2.offsetY - offsetY
        });
      };
      const onPointerEnd = (event2) => {
        if (event2.pointerId !== pointerId)
          return;
        const itemsContainer3 = getElementById("itemsContainer");
        itemsContainer3.removeEventListener("pointermove", onPointerMove);
        itemsContainer3.removeEventListener("pointerup", onPointerEnd);
        itemsContainer3.removeEventListener("pointercancel", onPointerEnd);
        task.classList.remove("dragged");
        if (moved) {
          const graphContainer2 = getElementById("graph");
          graphContainer2.dispatchEvent(new CustomEvent("taskmoved", {detail: {task}}));
        } else
          onTaskClicked(task, event2);
      };
      const itemsContainer2 = getElementById("itemsContainer");
      itemsContainer2.addEventListener("pointermove", onPointerMove);
      itemsContainer2.addEventListener("pointerup", onPointerEnd);
      itemsContainer2.addEventListener("pointercancel", onPointerEnd);
    }
  };
  sendSelectionChanged([]);
}
