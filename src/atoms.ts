import { atom, atomFamily, selector, selectorFamily } from "recoil";

import type {
  Dependency,
  DependencyId,
  Project,
  ProjectId,
  Task,
  TaskId,
} from "./types";

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

const projectIdState = atom<ProjectId>({
  key: "ProjectId",
  default: "spXxYVulTgfKcj0n1sWb",
});

const projectState = atom<Project>({
  key: "Project",
  default: {
    tasks: [],
    dependencies: [],
  },
});

const selectedTasksState = atom<TaskId[]>({
  key: "SelectedTasks",
  default: [],
});

const anyTasksSelectedSelector = selector<boolean>({
  key: "AnyTaskSelected",
  get: ({ get }) => get(selectedTasksState).length !== 0,
});

const taskSelectedSelectorFamily = selectorFamily<boolean, TaskId>({
  key: "TaskSelected",
  get:
    (id) =>
    ({ get }) =>
      get(selectedTasksState).includes(id),
});

const projectDependenciesSelector = selector({
  key: "ProjectDependencies",
  get: ({ get }) =>
    get(projectState).dependencies.map((dep) =>
      get(dependencyStateFamily(dep))
    ),
});

const projectTasksSelector = selector({
  key: "ProjectTasks",
  get: ({ get }) =>
    get(projectState).tasks.map((id) => ({ id, ...get(taskStateFamily(id)) })),
});

const drawModeState = atom<boolean>({
  key: "DrawMode",
  default: false,
});

export {
  projectIdState,
  projectState,
  dependencyStateFamily,
  taskStateFamily,
  selectedTasksState,
  anyTasksSelectedSelector,
  taskSelectedSelectorFamily,
  projectDependenciesSelector,
  projectTasksSelector,
  drawModeState,
};
