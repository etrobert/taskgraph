import { atom, atomFamily, selector, selectorFamily } from "recoil";
import { Set } from "immutable";

import type {
  Dependency,
  DependencyId,
  Workspace,
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

const workspaceState = atom<Workspace>({
  key: "Workspace",
  default: {
    tasks: [],
    dependencies: [],
  },
});

const taskIsInWorkspaceStateFamily = selectorFamily<boolean, TaskId>({
  key: "TaskIsInWorkspace",
  get:
    (id) =>
    ({ get }) =>
      get(workspaceState).tasks.includes(id),
});

const selectedElementsState = atom<{
  tasks: Set<TaskId>;
  dependencies: Set<DependencyId>;
}>({
  key: "SelectedElements",
  default: { tasks: Set(), dependencies: Set() },
});

const anyElementsSelectedState = selector<boolean>({
  key: "AnyElementsSelected",
  get: ({ get }) =>
    get(selectedElementsState).tasks.size !== 0 ||
    get(selectedElementsState).dependencies.size !== 0,
});

const taskSelectedStateFamily = selectorFamily<boolean, TaskId>({
  key: "TaskSelected",
  get:
    (id) =>
    ({ get }) =>
      get(selectedElementsState).tasks.includes(id),
});

const workspaceDependenciesState = selector({
  key: "WorkspaceDependencies",
  get: ({ get }) =>
    get(workspaceState).dependencies.map((id) => ({
      id,
      ...get(dependencyStateFamily(id)),
    })),
});

const workspaceTasksState = selector({
  key: "WorkspaceTasks",
  get: ({ get }) =>
    get(workspaceState).tasks.map((id) => ({
      id,
      ...get(taskStateFamily(id)),
    })),
});

const tasksWithoutPredecessorState = selector({
  key: "TasksWithoutPredecessor",
  get: ({ get }) => {
    const { tasks, dependencies } = get(workspaceState);
    return tasks.filter(
      (taskId) =>
        !dependencies.some(
          (depId) => get(dependencyStateFamily(depId)).successor === taskId
        )
    );
  },
});

const nextTaskState = selector<TaskId>({
  key: "NextTask",
  get: ({ get }) => {
    const { tasks } = get(workspaceState);
    return tasks.length === 0 ? "NO-TASK-FOUND" : tasks[0];
  },
});

export {
  authState,
  signedInUserIdState,
  workspaceState,
  dependencyStateFamily,
  taskStateFamily,
  selectedElementsState,
  anyElementsSelectedState,
  taskSelectedStateFamily,
  workspaceDependenciesState,
  workspaceTasksState,
  taskIsInWorkspaceStateFamily,
  tasksWithoutPredecessorState,
  nextTaskState,
};
