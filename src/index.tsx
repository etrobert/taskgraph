import React from "react";
import ReactDOM from "react-dom";
import { RecoilRoot } from "recoil";

import App from "./App/App";
import { dependencyStateFamily, projectState, taskStateFamily } from "./atoms";

const projectMockState = {
  tasks: ["task-1", "task-2"],
  dependencies: ["dependency-1"],
};

const task1Mock = {
  id: "task-1",
  name: "task-1",
  position: { x: 0, y: 0 },
  status: "ready",
} as const;

const task2Mock = {
  id: "task-2",
  name: "task-2",
  position: { x: 100, y: 100 },
  status: "ready",
} as const;

const dependencyMock = {
  id: "dependency-1",
  predecessor: "task-1",
  successor: "task-2",
};

document.addEventListener("DOMContentLoaded", () => {
  ReactDOM.render(
    <RecoilRoot
      initializeState={({ set }) => {
        set(projectState, projectMockState);
        set(taskStateFamily("task-1"), task1Mock);
        set(taskStateFamily("task-2"), task2Mock);
        set(dependencyStateFamily("dependency-1"), dependencyMock);
      }}
    >
      <App />
    </RecoilRoot>,
    document.getElementById("root")
  );
});
