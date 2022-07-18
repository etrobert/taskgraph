// [snowpack] add styles to the page (skip if no document exists)
if (typeof document !== 'undefined') {
  const code = ".LandingPage {\n  display: grid;\n  place-content: center;\n  height: 100%;\n  gap: 4rem;\n}\n\n.LandingPage__title {\n  font-size: 10rem;\n  line-height: 0.8em;\n}\n\n@media only screen and (max-width: 480px) {\n  .LandingPage {\n    gap: 2rem;\n  }\n\n  .LandingPage__title {\n    font-size: 7rem;\n  }\n}\n";

  const styleEl = document.createElement("style");
  const codeEl = document.createTextNode(code);
  styleEl.type = 'text/css';
  styleEl.appendChild(codeEl);
  document.head.appendChild(styleEl);
}