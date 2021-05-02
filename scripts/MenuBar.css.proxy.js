// [snowpack] add styles to the page (skip if no document exists)
if (typeof document !== 'undefined') {
  const code = ".MenuBar {\n  position: fixed;\n  left: 0;\n  top: 0;\n  bottom: 0;\n  background-color: #f9f9f9;\n  z-index: 2;\n  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;\n\n  display: grid;\n  grid-template-rows: auto 1fr auto;\n  row-gap: 2em;\n\n  padding: 2em;\n\n  transform: translateX(-100%);\n}\n\n.MenuBar__close-button {\n  position: absolute;\n  top: 0;\n  right: 0;\n  width: 2.1rem;\n  height: 2.1rem;\n  margin: 1rem;\n  background-image: url(\"resources/feather/x.svg\");\n}\n\n.MenuBar ul {\n  list-style: none;\n}\n\n.MenuBar__title {\n  font-family: \"PermanentMarker\";\n  font-size: 3rem;\n}\n\n.MenuBar.active {\n  transform: translate(0);\n  box-shadow: 0.2rem 0 1rem rgba(0, 0, 0, 0.5);\n}\n\n.MenuBar button {\n  border: none;\n  background-color: transparent;\n}\n\n.MenuBar button:hover {\n  text-decoration: underline;\n}\n\n.MenuBar__github-link {\n  width: 1.5rem;\n  height: 1.5rem;\n  background-size: contain;\n  background-image: url(\"resources/feather/github.svg\");\n}\n";

  const styleEl = document.createElement("style");
  const codeEl = document.createTextNode(code);
  styleEl.type = 'text/css';
  styleEl.appendChild(codeEl);
  document.head.appendChild(styleEl);
}