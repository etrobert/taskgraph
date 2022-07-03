import React from "react";
import { useRecoilValue } from "recoil";

import WorkspacesList from "../WorkspacesList/WorkspacesList";
import SignedInApp from "@/components/SignedInApp/SignedInApp";
import useSyncFirebaseAuth from "@/hooks/useSyncFirebaseAuth";
import { authState } from "@/atoms";

import "./App.css";

const App = (): JSX.Element => {
  useSyncFirebaseAuth();

  const auth = useRecoilValue(authState);

  if (auth.status === "signedIn") return <SignedInApp />;

  return <WorkspacesList />;
};

export default App;
