import { getGraph, loadGraph } from "./graph";

function downloadFile(
  filename: string,
  text: string,
  type = "data:text/plain;charset=utf-8"
) {
  const element = document.createElement("a");
  element.setAttribute("href", `${type}, ${encodeURIComponent(text)}`);
  element.setAttribute("download", filename);

  element.style.display = "none";
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}

function saveToFile(): void {
  const graph = getGraph();
  downloadFile(
    "graph.json",
    JSON.stringify(graph, null, 2),
    "data:text/json;charset=utf-8"
  );
}

function saveToLocalStorage(): void {
  const graph = getGraph();
  window.localStorage.setItem("graph", JSON.stringify(graph));
}

function loadFromLocalStorage(): void {
  const graphItem = window.localStorage.getItem("graph");
  if (!graphItem) return;
  const graph = JSON.parse(graphItem);
  loadGraph(graph);
}

export { saveToFile, saveToLocalStorage, loadFromLocalStorage };
