import React from "react";
import { useRecoilValue } from "recoil";

import LandingPage from "@/components/LandingPage/LandingPage";
import SignUp from "@/components/SignUp/SignUp";
import SignIn from "@/components/SignIn/SignIn";
import SignedInApp from "@/components/SignedInApp/SignedInApp";
import useSyncFirebaseAuth from "@/hooks/useSyncFirebaseAuth";
import { authState } from "@/atoms";

import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import "./App.css";

const App = (): JSX.Element => {
  useSyncFirebaseAuth();

  const auth = useRecoilValue(authState);

  if (auth.status === "signedIn") return <SignedInApp />;

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
