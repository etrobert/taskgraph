// [snowpack] add styles to the page (skip if no document exists)
if (typeof document !== 'undefined') {
  const code = "#graph {\n  height: 100%;\n  background-color: #ccc;\n  overflow: hidden;\n}\n\n.Graph__zoom-indicator {\n  position: absolute;\n  top: 0;\n  right: 0;\n  z-index: 1;\n}\n\n.task {\n  -webkit-tap-highlight-color: transparent;\n  user-select: none;\n  border-radius: 3px;\n  background-color: #ddd;\n  padding: 0.2em 0.4em;\n  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);\n  transition: box-shadow 0.2s ease;\n\n  position: absolute;\n  font-family: \"PermanentMarker\";\n  font-size: 2em;\n  line-height: 1em; /* ensure that the bounding box is not too high */\n  cursor: pointer;\n  white-space: nowrap;\n}\n\n.task:hover {\n  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);\n}\n\n.selected {\n  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);\n  background-color: aquamarine;\n}\n\n.task.dragged {\n  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23);\n  z-index: 1;\n}\n\n.task.completed {\n  opacity: 25%;\n}\n\n.task.completed::before {\n  content: \"\";\n  position: absolute;\n  --thickness: 0.2em;\n  height: var(--thickness);\n  top: calc(50% + var(--thickness) / 2);\n  left: 0;\n  right: 0;\n  background-color: black;\n  animation: 1s ease-in-out strikethrough;\n  border-radius: calc(var(--thickness) / 2);\n}\n\n@keyframes strikethrough {\n  from {\n    right: 100%;\n  }\n  to {\n    right: 0%;\n  }\n}\n\n#arrows {\n  position: absolute;\n  left: 0;\n  top: 0;\n  overflow: visible;\n}\n\n#arrows > path {\n  stroke: black;\n  stroke-width: 6px;\n  stroke-linecap: round;\n  marker-end: url(#Triangle);\n}\n";

  const styleEl = document.createElement("style");
  const codeEl = document.createTextNode(code);
  styleEl.type = 'text/css';
  styleEl.appendChild(codeEl);
  document.head.appendChild(styleEl);
}