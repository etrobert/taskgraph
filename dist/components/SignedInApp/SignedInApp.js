import React from "../../../_snowpack/pkg/react.js";
import {Route, BrowserRouter as Router, Switch} from "../../../_snowpack/pkg/react-router-dom.js";
import useSyncFirestore from "../../hooks/useSyncFirestore.js";
import GraphPage from "../GraphPage/GraphPage.js";
import TaskPage from "../TaskPage/TaskPage.js";
const SignedInApp = () => {
  useSyncFirestore();
  return /* @__PURE__ */ React.createElement(Router, null, /* @__PURE__ */ React.createElement(Switch, null, /* @__PURE__ */ React.createElement(Route, {
    path: "/task/:id",
    component: TaskPage
  }), /* @__PURE__ */ React.createElement(Route, {
    path: "/",
    component: GraphPage
  })));
};
export default SignedInApp;
