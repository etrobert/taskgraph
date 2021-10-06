import LandingPage from "@/LandingPage";
import React from "react";

import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import "./App.css";

const App = (): JSX.Element => {
  return (
    <Router>
      <Switch>
        <Route path="/graph">Graph</Route>
        <Route path="/">
          <LandingPage />;
        </Route>
      </Switch>
    </Router>
  );
};

export default App;
