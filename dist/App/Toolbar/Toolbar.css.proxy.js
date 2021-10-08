// [snowpack] add styles to the page (skip if no document exists)
if (typeof document !== 'undefined') {
  const code = ".Toolbar {\n  position: fixed;\n  right: 2em;\n  bottom: 2em;\n  z-index: 1;\n}\n\n.Toolbar__button {\n  width: 5em;\n  height: 5em;\n}\n\n.Toolbar__button-delete-selected {\n  background-image: url(\"resources/feather/trash-2.svg\");\n}\n\n.Toolbar__button-complete-selected {\n  background-image: url(\"resources/feather/check-circle.svg\");\n}\n\n.Toolbar__button-create-task {\n  background-image: url(\"resources/feather/plus-circle.svg\");\n}\n\n.Toolbar__button-change-link-mode {\n  background-image: url(\"resources/feather/link.svg\");\n\n  border-bottom: 0.2rem solid transparent;\n\n  /* Display the button correctly even with the border */\n  background-repeat: no-repeat;\n  background-position: center;\n}\n\n.Toolbar__button-change-link-mode--active {\n  border-bottom: 0.2rem solid;\n}\n";

  const styleEl = document.createElement("style");
  const codeEl = document.createTextNode(code);
  styleEl.type = 'text/css';
  styleEl.appendChild(codeEl);
  document.head.appendChild(styleEl);
}