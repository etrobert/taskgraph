import type { Point } from "./geometry";

type TaskId = string;

// See https://en.wikipedia.org/wiki/Task_management
type TaskStatus = "ready" | "completed";

type Task = {
  name: string;
  position: Point;
  status: TaskStatus;
};

type DependencyId = string;

type Dependency = {
  predecessor: TaskId;
  successor: TaskId;
};

type ProjectId = string;

type Project = {
  tasks: TaskId[];
  dependencies: DependencyId[];
};

export type { TaskId, Task, DependencyId, Dependency, ProjectId, Project };
