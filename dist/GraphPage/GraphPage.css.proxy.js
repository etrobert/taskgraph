// [snowpack] add styles to the page (skip if no document exists)
if (typeof document !== 'undefined') {
  const code = ".GraphPage__menu-bar-open-button {\n  position: absolute;\n  top: 0;\n  left: 0;\n  width: 2.1rem;\n  height: 2.1rem;\n  margin-left: 1rem;\n  margin-top: 0.8rem;\n  z-index: 1;\n  background-image: url(\"resources/feather/menu.svg\");\n}\n";

  const styleEl = document.createElement("style");
  const codeEl = document.createTextNode(code);
  styleEl.type = 'text/css';
  styleEl.appendChild(codeEl);
  document.head.appendChild(styleEl);
}