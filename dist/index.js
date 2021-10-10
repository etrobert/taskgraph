import React from "../_snowpack/pkg/react.js";
import ReactDOM from "../_snowpack/pkg/react-dom.js";
import {RecoilRoot} from "../_snowpack/pkg/recoil.js";
import App from "./components/App/App.js";
document.addEventListener("DOMContentLoaded", () => {
  ReactDOM.render(/* @__PURE__ */ React.createElement(RecoilRoot, null, /* @__PURE__ */ React.createElement(App, null)), document.getElementById("root"));
});
