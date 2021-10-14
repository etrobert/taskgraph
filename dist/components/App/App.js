import React from "../../../_snowpack/pkg/react.js";
import GraphPage from "../GraphPage/GraphPage.js";
import LandingPage from "../LandingPage/LandingPage.js";
import SignUp from "../SignUp/SignUp.js";
import SignIn from "../SignIn/SignIn.js";
import useSyncFirebaseAuth from "../../hooks/useSyncFirebaseAuth.js";
import {BrowserRouter as Router, Route, Switch} from "../../../_snowpack/pkg/react-router-dom.js";
import "./App.css.proxy.js";
const App = () => {
  useSyncFirebaseAuth();
  return /* @__PURE__ */ React.createElement(Router, null, /* @__PURE__ */ React.createElement(Switch, null, /* @__PURE__ */ React.createElement(Route, {
    path: "/signup"
  }, /* @__PURE__ */ React.createElement(SignUp, null)), /* @__PURE__ */ React.createElement(Route, {
    path: "/signin"
  }, /* @__PURE__ */ React.createElement(SignIn, null)), /* @__PURE__ */ React.createElement(Route, {
    path: "/graph"
  }, /* @__PURE__ */ React.createElement(GraphPage, null)), /* @__PURE__ */ React.createElement(Route, {
    path: "/"
  }, /* @__PURE__ */ React.createElement(LandingPage, null))));
};
export default App;
