import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import LandingPage from "../LandingPage/LandingPage";
import GraphPage from "../GraphPage/GraphPage";

import "./App.css";

const App = (): JSX.Element => (
  <Router>
    <Switch>
      <Route path="/workspaces/:workspaceId">
        <GraphPage />
      </Route>
      <Route path="/">
        <LandingPage />
      </Route>
    </Switch>
  </Router>
);

export default App;
