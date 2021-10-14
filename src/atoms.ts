import { atom, atomFamily, selector, selectorFamily } from "recoil";

import type {
  Dependency,
  DependencyId,
  Project,
  ProjectId,
  Task,
  TaskId,
  UserId,
} from "./types";

type AuthState =
  | { status: "loading" }
  | { status: "notSignedIn" }
  | {
      status: "signedIn";
      userId: UserId;
    };

const authState = atom<AuthState>({
  key: "Auth",
  default: { status: "loading" },
});

const signedInUserIdState = selector<UserId>({
  key: "SignedInUserId",
  get: ({ get }) => {
    const auth = get(authState);
    return auth.status === "signedIn" ? auth.userId : "NOT_SIGNED_IN";
  },
});

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

const selectedElementsState = atom<{
  tasks: TaskId[];
  dependencies: DependencyId[];
}>({
  key: "SelectedElements",
  default: { tasks: [], dependencies: [] },
});

const anyElementsSelectedState = selector<boolean>({
  key: "AnyElementsSelected",
  get: ({ get }) =>
    get(selectedElementsState).tasks.length !== 0 ||
    get(selectedElementsState).dependencies.length !== 0,
});

const taskSelectedStateFamily = selectorFamily<boolean, TaskId>({
  key: "TaskSelected",
  get:
    (id) =>
    ({ get }) =>
      get(selectedElementsState).tasks.includes(id),
});

const projectDependenciesState = selector({
  key: "ProjectDependencies",
  get: ({ get }) =>
    get(projectState).dependencies.map((id) => ({
      id,
      ...get(dependencyStateFamily(id)),
    })),
});

const projectTasksState = selector({
  key: "ProjectTasks",
  get: ({ get }) =>
    get(projectState).tasks.map((id) => ({ id, ...get(taskStateFamily(id)) })),
});

const drawModeState = atom<boolean>({
  key: "DrawMode",
  default: false,
});

export {
  authState,
  signedInUserIdState,
  projectIdState,
  projectState,
  dependencyStateFamily,
  taskStateFamily,
  selectedElementsState,
  anyElementsSelectedState,
  taskSelectedStateFamily,
  projectDependenciesState,
  projectTasksState,
  drawModeState,
};
