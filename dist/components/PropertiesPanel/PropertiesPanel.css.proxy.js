// [snowpack] add styles to the page (skip if no document exists)
if (typeof document !== 'undefined') {
  const code = ".PropertiesPanel {\n  width: 20rem;\n  padding: 1rem;\n  box-sizing: border-box;\n  display: grid;\n  align-content: start;\n  gap: 1rem;\n\n  box-shadow: 0.2rem 0 1rem rgba(0, 0, 0, 0.5);\n}\n";

  const styleEl = document.createElement("style");
  const codeEl = document.createTextNode(code);
  styleEl.type = 'text/css';
  styleEl.appendChild(codeEl);
  document.head.appendChild(styleEl);
}