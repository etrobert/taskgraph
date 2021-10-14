// [snowpack] add styles to the page (skip if no document exists)
if (typeof document !== 'undefined') {
  const code = ".AuthPage {\n  display: grid;\n  align-content: center;\n  height: 100%;\n}\n\n.AuthPage__container {\n  display: grid;\n  align-content: center;\n  gap: 2rem;\n\n  --padding: 1rem;\n\n  padding-left: var(--padding);\n  padding-right: var(--padding);\n  width: calc(100% - 2 * var(--padding));\n}\n\n@media only screen and (min-width: 600px) {\n  .AuthPage {\n    grid-template-rows: 30rem;\n    justify-content: center;\n  }\n\n  .AuthPage__container {\n    grid-template-columns: 25rem;\n    border-radius: 0.5rem;\n    box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22);\n\n    --padding: 4rem;\n  }\n}\n\n.AuthPage h1 {\n  font-size: 4rem;\n}\n";

  const styleEl = document.createElement("style");
  const codeEl = document.createTextNode(code);
  styleEl.type = 'text/css';
  styleEl.appendChild(codeEl);
  document.head.appendChild(styleEl);
}