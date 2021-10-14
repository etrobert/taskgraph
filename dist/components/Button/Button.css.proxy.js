// [snowpack] add styles to the page (skip if no document exists)
if (typeof document !== 'undefined') {
  const code = ".Button {\n  padding: 1rem 3rem;\n\n  display: grid;\n  place-content: center;\n\n  text-decoration: none;\n\n  font-size: 1.5rem;\n  font-weight: bold;\n  color: white;\n  background-color: black;\n  border: none;\n  cursor: pointer;\n  border-radius: 0.5rem;\n}\n";

  const styleEl = document.createElement("style");
  const codeEl = document.createTextNode(code);
  styleEl.type = 'text/css';
  styleEl.appendChild(codeEl);
  document.head.appendChild(styleEl);
}