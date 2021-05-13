import {
  squaredDistance,
  getBoxCenter,
  getExpandedBox,
  getOffsetBox,
  intersectLineBox,
  Point,
} from "./geometry.js";
import { getElementById, removeFromArray } from "./misc.js";

interface HTMLTaskElement extends HTMLElement {
  textContent: string;
  from: HTMLDependencyElement[];
  to: HTMLDependencyElement[];
}

interface HTMLDependencyElement extends HTMLElement {
  from: HTMLTaskElement;
  to: HTMLTaskElement;
}

interface Task {
  name: string;
  status: "todo" | "completed";
  pos: Point;
}

interface Dependency {
  predecessor: string;
  successor: string;
}

export interface Graph {
  tasks: Task[];
  dependencies: Dependency[];
}

// Has the correct size
// Used to initially capture mouse events
// const graphContainer = getElementById("graph");

// Contains the tasks and dependencies
// Will get translated around
// const itemsContainer = getElementById("itemsContainer");

// const arrows = getElementById("arrows");

function getTasks(): HTMLTaskElement[] {
  const isTask = (e: HTMLElement) => e.classList.contains("task");
  const itemsContainer = getElementById("itemsContainer");
  const elements = Array.from(itemsContainer.children) as HTMLElement[];
  return elements.filter(isTask) as HTMLTaskElement[];
}

function getDependencies(): HTMLDependencyElement[] {
  const isDependency = (e: HTMLElement) => e.tagName === "path";
  const arrows = getElementById("arrows");
  const elements = Array.from(arrows.children) as HTMLElement[];
  return elements.filter(isDependency) as HTMLDependencyElement[];
}

export function clearGraph(): void {
  const removeElement = (e: HTMLElement) => {
    if (e.parentNode) e.parentNode.removeChild(e);
  };
  const tasks = getTasks();
  tasks.forEach(removeElement);
  const dependencies = getDependencies();
  dependencies.forEach(removeElement);
}

function getViewCenter(): Point {
  const graphContainer = getElementById("graph");
  const box = getOffsetBox(graphContainer);
  const viewCenter = getBoxCenter(box);
  const window = getWindow();
  return {
    x: viewCenter.x - window.pan.x,
    y: viewCenter.y - window.pan.y,
  };
}

function computeCenteredPos(element: HTMLElement): Point {
  const viewCenter = getViewCenter();
  const width = element.offsetWidth;
  const height = element.offsetHeight;
  return {
    x: viewCenter.x - width / 2,
    y: viewCenter.y - height / 2,
  };
}

interface AddTask extends Partial<Task> {
  name: string;
}

export function addTask(task: AddTask): HTMLTaskElement {
  const htmlTask = document.createElement("div") as unknown as HTMLTaskElement;
  htmlTask.classList.add("task");
  htmlTask.textContent = task.name;
  htmlTask.from = [];
  htmlTask.to = [];
  if (task.status === "completed") htmlTask.classList.add("completed");
  const itemsContainer = getElementById("itemsContainer");
  itemsContainer.appendChild(htmlTask);
  const pos = task.pos ? task.pos : computeCenteredPos(htmlTask);
  htmlTask.style.left = pos.x + "px";
  htmlTask.style.top = pos.y + "px";
  return htmlTask;
}

function addDependency(dependency: Dependency) {
  const dependencyHtml = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "path"
  ) as unknown as HTMLDependencyElement;
  const tasks = getTasks();
  const predecessor = tasks.find(
    (task) => task.textContent === dependency.predecessor
  );
  if (!predecessor) {
    console.error(
      "Could not add dependency: predecessor not found",
      dependency
    );
    return;
  }
  const successor = tasks.find(
    (task) => task.textContent === dependency.successor
  );
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

function deleteTask(task: HTMLTaskElement) {
  const from = task.from.slice();
  from.forEach(deleteDependency);
  const to = task.to.slice();
  to.forEach(deleteDependency);
  const itemsContainer = getElementById("itemsContainer");
  itemsContainer.removeChild(task);
}

function deleteDependency(dependency: HTMLDependencyElement) {
  removeFromArray(dependency.from.from, dependency);
  removeFromArray(dependency.to.to, dependency);
  const arrows = getElementById("arrows");
  arrows.removeChild(dependency);
}

export function selectAll(): void {
  const tasks = getTasks();
  tasks.forEach((t) => t.classList.add("selected"));
  sendSelectionChanged(tasks);
}

export function deleteSelected(): void {
  const selected = getSelected();
  selected.forEach(deleteTask);
  sendSelectionChanged([]);
}

export function completeSelected(): void {
  const selected = getSelected();
  selected.forEach((task) => task.classList.toggle("completed"));
}

function onTaskClicked(task: HTMLTaskElement, event: MouseEvent) {
  if (event.shiftKey) {
    task.classList.toggle("selected");
    sendSelectionChanged();
  } else {
    resetSelected();
    task.classList.add("selected");
    sendSelectionChanged([task]);
  }
}

/**
 * sends out a "selectionchanged" event
 * @param {[HTMLElement]} selection if known by the caller, passthrough
 */
function sendSelectionChanged(selection?: HTMLTaskElement[]) {
  const graphContainer = getElementById("graph");
  graphContainer.dispatchEvent(
    new CustomEvent("selectionchanged", {
      detail: selection ? selection : getSelected(),
    })
  );
}

function getSelected() {
  const isSelected = (e: HTMLTaskElement) => e.classList.contains("selected");
  return getTasks().filter(isSelected);
}

function resetSelected() {
  const selectedTasks = getSelected();
  selectedTasks.forEach((task) => task.classList.remove("selected"));
}

export function loadGraph(graph: Graph): void {
  clearGraph();
  graph.tasks.forEach(addTask);
  graph.dependencies.forEach(addDependency);
}

export function getGraph(): Graph {
  const tasksHtml = getTasks();
  const tasks = tasksHtml.map((e) => {
    const bb = getOffsetBox(e);
    return {
      name: e.textContent,
      pos: { x: bb.left, y: bb.top },
      status: e.classList.contains("completed")
        ? ("completed" as const)
        : ("todo" as const),
    };
  });
  const dependenciesHtml = getDependencies();
  const dependencies = dependenciesHtml.map((e) => ({
    predecessor: e.from.textContent,
    successor: e.to.textContent,
  }));
  return { tasks, dependencies };
}

// updates the visual representation of path
// if dest if specified, use instead of path.to
function updatePath(path: HTMLDependencyElement, dest?: Point) {
  const nodeABox = getOffsetBox(path.from);
  const nodeBBox = dest ? null : getOffsetBox(path.to);

  const centerA = getBoxCenter(nodeABox);
  // If dest is undefined then nodeBBox is not null
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const centerB = dest ? dest : getBoxCenter(nodeBBox!);

  const offset = 8;

  const pathPointA = intersectLineBox(
    centerA,
    centerB,
    getExpandedBox(nodeABox, offset)
  );
  const pathPointB = dest
    ? dest
    : // If dest is undefined then nodeBBox is not null
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      intersectLineBox(centerA, centerB, getExpandedBox(nodeBBox!, offset));

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

const getWindow = () => {
  const graph = getElementById("graph");
  const { windowPanX, windowPanY, windowZoom } = graph.dataset;

  if (
    windowPanX === undefined ||
    windowPanY === undefined ||
    windowZoom === undefined
  )
    throw new Error("window values missing");

  return {
    pan: {
      x: parseFloat(windowPanX),
      y: parseFloat(windowPanY),
    },
    zoom: parseFloat(windowZoom),
  };
};

function onGraphDragStart(event: PointerEvent) {
  const itemsContainer = getElementById("itemsContainer");
  itemsContainer.setPointerCapture(event.pointerId);
  let previousPosition = { x: event.clientX, y: event.clientY };
  const onPointerMove = (event: PointerEvent) => {
    const window = getWindow();
    const x = window.pan.x + event.clientX - previousPosition.x;
    const y = window.pan.y + event.clientY - previousPosition.y;
    previousPosition = { x: event.clientX, y: event.clientY };

    const graphContainer = getElementById("graph");
    graphContainer.dispatchEvent(
      new CustomEvent("graphmoved", { detail: { pan: { x, y } } })
    );
  };
  const onPointerEnd = () => {
    const itemsContainer = getElementById("itemsContainer");
    itemsContainer.removeEventListener("pointermove", onPointerMove);
    itemsContainer.removeEventListener("pointerup", onPointerEnd);
  };
  itemsContainer.addEventListener("pointermove", onPointerMove);
  itemsContainer.addEventListener("pointerup", onPointerEnd);
}

function moveTask(task: HTMLTaskElement, pos: Point) {
  task.style.left = pos.x + "px";
  task.style.top = pos.y + "px";
  for (const path of [...task.from, ...task.to]) updatePath(path);
}

export function initGraph(): void {
  const graphContainer = getElementById("graph");
  graphContainer.onpointerdown = (event) => {
    event.preventDefault();
    let moved = false;
    const target = event.target;
    if (!target || !(target as HTMLElement).classList.contains("task")) {
      resetSelected();
      sendSelectionChanged([]);
      onGraphDragStart(event);
      return;
    }
    const task = target as HTMLTaskElement;
    const pointerId = event.pointerId;
    const itemsContainer = getElementById("itemsContainer");
    itemsContainer.setPointerCapture(pointerId);
    const initialPosition = { x: event.clientX, y: event.clientY };
    const linkModeCheckbox = getElementById(
      "linkModeCheckbox"
    ) as HTMLInputElement;
    if (event.shiftKey || linkModeCheckbox.checked) {
      // Initiate link creation
      const path = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "path"
      ) as unknown as HTMLDependencyElement;
      path.from = task;
      const arrows = getElementById("arrows");
      arrows.appendChild(path);
      const onPointerMove = (event: PointerEvent) => {
        if (event.pointerId !== pointerId) return;
        moved = true;
        updatePath(path, { x: event.offsetX, y: event.offsetY });
      };
      const onPointerEnd = (event: PointerEvent) => {
        if (event.pointerId !== pointerId) return;
        if (!moved) onTaskClicked(task, event);
        const itemsContainer = getElementById("itemsContainer");
        itemsContainer.removeEventListener("pointermove", onPointerMove);
        itemsContainer.removeEventListener("pointerup", onPointerEnd);
        itemsContainer.removeEventListener("pointercancel", onPointerEnd);
        const target = document.elementFromPoint(event.pageX, event.pageY);
        // TODO Prevent a link to itself
        // TODO Prevent a link to a dependency
        // TODO Prevent a link to a target from which it's a dependency
        if (!target || !target.classList.contains("task")) {
          const arrows = getElementById("arrows");
          arrows.removeChild(path);
          return;
        }
        const targetTask = target as HTMLTaskElement;
        path.to = targetTask;
        task.from.push(path);
        targetTask.to.push(path);
        updatePath(path);
        const graphContainer = getElementById("graph");
        graphContainer.dispatchEvent(new CustomEvent("newdependency"));
      };
      const itemsContainer = getElementById("itemsContainer");
      itemsContainer.addEventListener("pointermove", onPointerMove);
      itemsContainer.addEventListener("pointerup", onPointerEnd);
      itemsContainer.addEventListener("pointercancel", onPointerEnd);
    } else {
      // Initiate Drag
      const offsetX = event.offsetX;
      const offsetY = event.offsetY;
      task.classList.add("dragged");
      const onPointerMove = (event: PointerEvent) => {
        if (event.pointerId !== pointerId) return;
        const currentPosition = { x: event.clientX, y: event.clientY };
        const movedThreshold = 5; // px
        const squaredMovedThreshold = movedThreshold * movedThreshold;
        if (
          squaredDistance(initialPosition, currentPosition) >
          squaredMovedThreshold
        )
          moved = true;
        moveTask(task, {
          x: event.offsetX - offsetX,
          y: event.offsetY - offsetY,
        });
      };
      const onPointerEnd = (event: PointerEvent) => {
        if (event.pointerId !== pointerId) return;
        const itemsContainer = getElementById("itemsContainer");
        itemsContainer.removeEventListener("pointermove", onPointerMove);
        itemsContainer.removeEventListener("pointerup", onPointerEnd);
        itemsContainer.removeEventListener("pointercancel", onPointerEnd);
        task.classList.remove("dragged");
        if (moved) {
          const graphContainer = getElementById("graph");
          graphContainer.dispatchEvent(
            new CustomEvent("taskmoved", { detail: { task } })
          );
        } else onTaskClicked(task, event);
      };
      const itemsContainer = getElementById("itemsContainer");
      itemsContainer.addEventListener("pointermove", onPointerMove);
      itemsContainer.addEventListener("pointerup", onPointerEnd);
      itemsContainer.addEventListener("pointercancel", onPointerEnd);
    }
  };
  sendSelectionChanged([]);
}
