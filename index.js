"use strict";

// TODO change to a correct include
import cytoscape from "./node_modules/cytoscape/dist/cytoscape.esm.min.js";

document.addEventListener("DOMContentLoaded", (event) => {
  const cy = cytoscape({
    container: document.getElementById("cy"),
    elements: [
      {
        data: { id: "a", name: "Arroser les plantes" },
      },
      {
        data: { id: "b", name: "Remplir l'arrosoir" },
      },
      { data: { id: "ab", source: "a", target: "b" } },
    ],
    style: [
      {
        selector: "node",
        style: {
          width: "label",
          height: "label",
          "background-color": "rgb(139, 108, 68)",
          padding: "1em",

          label: "data(name)",
          "font-family": "PermanentMarker",
          "font-size": "1.5em",
          "text-valign": "center",
        },
      },
      {
        selector: "edge",
        style: {
          "target-arrow-shape": "triangle",
          "line-color": "black",
          "target-arrow-color": "black",
          "curve-style": "bezier",
        },
      },
    ],
  });

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
});
