import { Box, Point } from "@/geometry";
import { atom, atomFamily, selectorFamily } from "recoil";

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

type BoxSize = {
  width: number;
  height: number;
};

const taskBoxSizeStateFamily = atomFamily<BoxSize, TaskId>({
  key: "TaskBoxSize",
  default: {
    width: 0,
    height: 0,
  },
});

const taskBoxSelectorFamily = selectorFamily<Box, TaskId>({
  key: "TaskExtendedBoudingBox",
  get:
    (id) =>
    ({ get }) => {
      const { width, height } = get(taskBoxSizeStateFamily(id));
      const {
        position: { x, y },
      } = get(taskStateFamily(id));
      return {
        left: x,
        right: x + width,
        top: y,
        bottom: y + height,
        width,
        height,
      };
    },
});

export {
  graphState,
  dependencyStateFamily,
  taskStateFamily,
  taskBoxSizeStateFamily,
  taskBoxSelectorFamily,
};
