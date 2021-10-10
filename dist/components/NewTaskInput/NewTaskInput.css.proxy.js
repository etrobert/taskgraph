// [snowpack] add styles to the page (skip if no document exists)
if (typeof document !== 'undefined') {
  const code = ".NewTask {\n  position: absolute;\n  left: 0;\n  right: 0;\n  height: 1.5em;\n  top: calc(50% - (1.5em / 2));\n  margin: auto;\n\n  z-index: 1;\n\n  width: 80vw;\n  padding: 1em;\n\n  opacity: 80%;\n\n  font-family: \"PermanentMarker\";\n  font-size: 1.5em;\n}\n";

  const styleEl = document.createElement("style");
  const codeEl = document.createTextNode(code);
  styleEl.type = 'text/css';
  styleEl.appendChild(codeEl);
  document.head.appendChild(styleEl);
}