import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import WorkspacesList from "../WorkspacesList/WorkspacesList";
import GraphPage from "../GraphPage/GraphPage";

import "./App.css";

const App = (): JSX.Element => (
  <Router>
    <Switch>
      <Route path="/workspaces/:workspaceId">
        <GraphPage />
      </Route>
      <Route path="/">
        <WorkspacesList />
      </Route>
    </Switch>
  </Router>
);

export default App;
