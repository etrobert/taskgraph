import type { Point } from "./geometry";

type TaskId = string;

// See https://en.wikipedia.org/wiki/Task_management
type TaskStatus = "ready" | "completed";

type Priority = "veryLow" | "low" | "normal" | "high" | "veryHigh";

type Task = {
  name: string;
  position: Point;
  status: TaskStatus;
  priority?: Priority;
};

type DependencyId = string;

type Dependency = {
  predecessor: TaskId;
  successor: TaskId;
};

type WorkspaceId = string;

type Workspace = {
  tasks: TaskId[];
  dependencies: DependencyId[];
};

type UserId = string;

export type {
  UserId,
  TaskId,
  Task,
  DependencyId,
  Dependency,
  WorkspaceId,
  Workspace,
  Priority,
};
