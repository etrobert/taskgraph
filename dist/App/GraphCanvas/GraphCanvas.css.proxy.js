// [snowpack] add styles to the page (skip if no document exists)
if (typeof document !== 'undefined') {
  const code = "#graph {\n  height: 100%;\n  background-color: #ccc;\n  overflow: hidden;\n}\n\n.Graph__zoom-indicator {\n  position: absolute;\n  top: 0;\n  right: 0;\n  z-index: 1;\n}\n\n.selected {\n  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);\n  background-color: aquamarine;\n}\n\n@keyframes strikethrough {\n  from {\n    right: 100%;\n  }\n  to {\n    right: 0%;\n  }\n}\n";

  const styleEl = document.createElement("style");
  const codeEl = document.createTextNode(code);
  styleEl.type = 'text/css';
  styleEl.appendChild(codeEl);
  document.head.appendChild(styleEl);
}