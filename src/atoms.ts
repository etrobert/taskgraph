import {
  Box,
  getBoxCenter,
  getExpandedBox,
  intersectLineBox,
  Point,
} from "@/geometry";
import { atom, atomFamily, selector, selectorFamily } from "recoil";

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

export interface Graph {
  tasks: TaskId[];
  dependencies: DependencyId[];
}

const taskStateFamily = atomFamily<Task, TaskId>({
  key: "Task",
  default: {
    name: "DEFAULT-TASK-NAME",
    position: { x: 0, y: 0 },
    status: "ready",
  },
});

const dependencyStateFamily = atomFamily<Dependency, DependencyId>({
  key: "Dependency",
  default: {
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

const selectedTasksState = atom<TaskId[]>({
  key: "SelectedTasks",
  default: [],
});

const taskSelectedSelectorFamily = selectorFamily<boolean, TaskId>({
  key: "TaskSelected",
  get:
    (id) =>
    ({ get }) =>
      get(selectedTasksState).includes(id),
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

const graphTasksSelector = selector({
  key: "Tasks",
  get: ({ get }) => {
    const { tasks } = get(graphState);
    return tasks.map((id) => get(taskStateFamily(id)));
  },
});

const graphDependenciesSelector = selector({
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
  graphTasksSelector,
  graphDependenciesSelector,
  selectedTasksState,
  taskSelectedSelectorFamily,
};

export type { BoxSize, DependencyId, TaskId };
