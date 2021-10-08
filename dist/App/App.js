import GraphPage from "../GraphPage/GraphPage.js";
import LandingPage from "../LandingPage.js";
import React from "../../_snowpack/pkg/react.js";
import {BrowserRouter as Router, Route, Switch} from "../../_snowpack/pkg/react-router-dom.js";
import "./App.css.proxy.js";
const App = () => {
  return /* @__PURE__ */ React.createElement(Router, null, /* @__PURE__ */ React.createElement(Switch, null, /* @__PURE__ */ React.createElement(Route, {
    path: "/graph"
  }, /* @__PURE__ */ React.createElement(GraphPage, null)), /* @__PURE__ */ React.createElement(Route, {
    path: "/"
  }, /* @__PURE__ */ React.createElement(LandingPage, null), ";")));
};
export default App;
