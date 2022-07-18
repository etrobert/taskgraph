import React from "react";

import WorkspacesList from "@/components/WorkspacesList/WorkspacesList";

import "./LandingPage.css";

const LandingPage = (): JSX.Element => {
  return (
    <div className="LandingPage">
      <h1 className="LandingPage__title">
        Task
        <br />
        Graph
      </h1>
      <WorkspacesList />
    </div>
  );
};
export default LandingPage;
