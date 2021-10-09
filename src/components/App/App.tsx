import React from "react";

import GraphPage from "@/components/GraphPage/GraphPage";
import LandingPage from "@/components/LandingPage/LandingPage";

import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import "./App.css";

const App = (): JSX.Element => {
  return (
    <Router>
      <Switch>
        <Route path="/graph">
          <GraphPage />
        </Route>
        <Route path="/">
          <LandingPage />
        </Route>
      </Switch>
    </Router>
  );
};

export default App;
