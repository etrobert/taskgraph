import React from "react";
import { Route, BrowserRouter as Router, Switch } from "react-router-dom";

import useSyncFirestore from "@/hooks/useSyncFirestore";
import GraphPage from "@/components/GraphPage/GraphPage";
import TaskPage from "@/components/TaskPage/TaskPage";

const SignedInApp = (): JSX.Element => {
  useSyncFirestore();

  return (
    <Router>
      <Switch>
        <Route path="/task/:id" component={TaskPage} />
        <Route path="/" component={GraphPage} />
      </Switch>
    </Router>
  );
};

export default SignedInApp;
