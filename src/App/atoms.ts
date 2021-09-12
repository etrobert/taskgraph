import { Point } from "@/geometry";
import { atom, atomFamily } from "recoil";

type TaskId = string;

type Task = {
  id: TaskId;
  name: string;
  position: Point;
};

type DependencyId = string;

type Dependency = {
  id: DependencyId;
  predecessor: TaskId;
  successor: TaskId;
};

export interface Graph {
  tasks: TaskId[];
  dependencies: DependencyId[];
}

const taskStateFamily = atomFamily<Task, TaskId>({
  key: "Task",
  default: {
    id: "DEFAULT-TASK-ID",
    name: "DEFAULT-TASK-NAME",
    position: { x: 0, y: 0 },
  },
});

const dependencyStateFamily = atomFamily<Dependency, DependencyId>({
  key: "Dependency",
  default: {
    id: "DEFAULT-DEPENDENCY-ID",
    predecessor: "DEFAULT-TASK-ID",
    successor: "DEFAULT-TASK-ID",
  },
});

const graphState = atom<Graph>({
  key: "Graph",
  default: {
    tasks: [],
    dependencies: [],
  },
});

export { graphState, dependencyStateFamily, taskStateFamily };
