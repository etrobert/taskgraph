import React from "../snowpack/pkg/react.js";
import ReactDOM from "../snowpack/pkg/react-dom.js";
import {RecoilRoot} from "../snowpack/pkg/recoil.js";
import App from "./App/App.js";
document.addEventListener("DOMContentLoaded", () => {
  ReactDOM.render(/* @__PURE__ */ React.createElement(RecoilRoot, null, /* @__PURE__ */ React.createElement(App, null)), document.getElementById("root"));
});