import React from "../../../_snowpack/pkg/react.js";
import {BrowserRouter as Router, Route, Switch} from "../../../_snowpack/pkg/react-router-dom.js";
import LandingPage from "../LandingPage/LandingPage.js";
import GraphPage from "../GraphPage/GraphPage.js";
import "./App.css.proxy.js";
const App = () => /* @__PURE__ */ React.createElement(Router, null, /* @__PURE__ */ React.createElement(Switch, null, /* @__PURE__ */ React.createElement(Route, {
  path: "/workspaces/:workspaceId"
}, /* @__PURE__ */ React.createElement(GraphPage, null)), /* @__PURE__ */ React.createElement(Route, {
  path: "/"
}, /* @__PURE__ */ React.createElement(LandingPage, null))));
export default App;
