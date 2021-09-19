import {getGraph} from "./graph.js";
function downloadFile(filename, text, type = "data:text/plain;charset=utf-8") {
  const element = document.createElement("a");
  element.setAttribute("href", `${type}, ${encodeURIComponent(text)}`);
  element.setAttribute("download", filename);
  element.style.display = "none";
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}
function saveToFile() {
  const graph = getGraph();
  downloadFile("graph.json", JSON.stringify(graph, null, 2), "data:text/json;charset=utf-8");
}
function saveToLocalStorage(graph) {
  window.localStorage.setItem("graph", JSON.stringify(graph));
}
function loadFromLocalStorage() {
  const graphItem = window.localStorage.getItem("graph");
  if (!graphItem)
    return null;
  const graph = JSON.parse(graphItem);
  return graph;
}
export {saveToFile, saveToLocalStorage, loadFromLocalStorage};
