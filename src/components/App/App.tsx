import React from "react";
import { useRecoilValue } from "recoil";

import GraphPage from "@/components/GraphPage/GraphPage";
import LandingPage from "@/components/LandingPage/LandingPage";
import SignUp from "@/components/SignUp/SignUp";
import SignIn from "@/components/SignIn/SignIn";
import TaskPage from "@/components/TaskPage/TaskPage";
import useSyncFirebaseAuth from "@/hooks/useSyncFirebaseAuth";
import { authState } from "@/atoms";

import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import "./App.css";

const App = (): JSX.Element => {
  useSyncFirebaseAuth();

  const auth = useRecoilValue(authState);

  if (auth.status === "signedIn")
    return (
      <Router>
        <Switch>
          <Route path="/task/:id" component={TaskPage} />
          <Route path="/" component={GraphPage} />
        </Switch>
      </Router>
    );

  return (
    <Router>
      <Switch>
        <Route path="/signup">
          <SignUp />
        </Route>
        <Route path="/signin">
          <SignIn />
        </Route>
        <Route path="/">
          <LandingPage />
        </Route>
      </Switch>
    </Router>
  );
};

export default App;
