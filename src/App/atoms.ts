import {
  Box,
  getBoxCenter,
  getExpandedBox,
  intersectLineBox,
  Point,
} from "@/geometry";
import { atom, atomFamily, selector, selectorFamily } from "recoil";

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

const taskCenterSelectorFamily = selectorFamily<Point, TaskId>({
  key: "TaskCenter",
  get:
    (id) =>
    ({ get }) => {
      const box = get(taskBoxSelectorFamily(id));

      return getBoxCenter(box);
    },
});

const dependencyPathSelectorFamily = selectorFamily<string, DependencyId>({
  key: "DependencyPath",
  get:
    (id) =>
    ({ get }) => {
      const { predecessor, successor } = get(dependencyStateFamily(id));
      const predecessorCenter = get(taskCenterSelectorFamily(predecessor));
      const successorCenter = get(taskCenterSelectorFamily(successor));

      const offset = 8;

      const predecessorBox = get(taskBoxSelectorFamily(predecessor));
      const expandedPredecessorBox = getExpandedBox(predecessorBox, offset);

      const pathPointPredecessor = intersectLineBox(
        predecessorCenter,
        successorCenter,
        expandedPredecessorBox
      );

      const successorBox = get(taskBoxSelectorFamily(successor));
      const expandedSuccessorBox = getExpandedBox(successorBox, offset);

      const pathPointSuccessor = intersectLineBox(
        predecessorCenter,
        successorCenter,
        expandedSuccessorBox
      );

      // TODO handle this error properly
      if (pathPointPredecessor === null || pathPointSuccessor === null)
        return "";

      return `M${pathPointPredecessor.x},${pathPointPredecessor.y}
              L${pathPointSuccessor.x},${pathPointSuccessor.y}`;
    },
});

const tasksSelector = selector({
  key: "Tasks",
  get: ({ get }) => {
    const { tasks } = get(graphState);
    return tasks.map((id) => get(taskStateFamily(id)));
  },
});

const dependenciesSelector = selector({
  key: "Dependencies",
  get: ({ get }) => {
    const { dependencies } = get(graphState);
    return dependencies.map((id) => get(dependencyStateFamily(id)));
  },
});

export {
  graphState,
  dependencyStateFamily,
  taskStateFamily,
  taskBoxSizeStateFamily,
  taskBoxSelectorFamily,
  dependencyPathSelectorFamily,
  tasksSelector,
  dependenciesSelector,
};
