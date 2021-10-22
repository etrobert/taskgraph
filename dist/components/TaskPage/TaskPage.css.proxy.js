// [snowpack] add styles to the page (skip if no document exists)
if (typeof document !== 'undefined') {
  const code = ".TaskPage {\n  display: grid;\n  gap: 1rem;\n  height: 100%;\n  place-content: center;\n}\n\n.TaskPage__close-button {\n  position: absolute;\n  width: 3rem;\n  height: 3rem;\n  background-image: url(\"/resources/feather/x.svg\");\n}\n";

  const styleEl = document.createElement("style");
  const codeEl = document.createTextNode(code);
  styleEl.type = 'text/css';
  styleEl.appendChild(codeEl);
  document.head.appendChild(styleEl);
}