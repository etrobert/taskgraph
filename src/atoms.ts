import { atom, atomFamily, selector, selectorFamily } from "recoil";
import { Set } from "immutable";

import type {
  Dependency,
  DependencyId,
  Workspace,
  Task,
  TaskId,
  UserId,
  Priority,
} from "./types";
import compareByPriority from "./compareByPriority";
import PriorityEnum from "./PriorityEnum";

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

const taskSuccessorsStateFamily = selectorFamily<TaskId[], TaskId>({
  key: "TaskSuccessors",
  get:
    (id) =>
    ({ get }) =>
      get(workspaceDependenciesState)
        .filter((dep) => dep.predecessor === id)
        .map((dep) => dep.successor),
});

/**
 * Returns the cumulated priority of a task taking into account its successors
 */
const cumulatedTaskPriorityStateFamily = selectorFamily<Priority, TaskId>({
  key: "CumulatedTaskPriority",
  get:
    (id) =>
    ({ get }) => {
      const myPriority = get(taskStateFamily(id)).priority ?? "normal";
      const successors = get(taskSuccessorsStateFamily(id));
      const successorsCumulatedPriorities = successors.map((succId) =>
        get(cumulatedTaskPriorityStateFamily(succId))
      );
      const priorities = [myPriority, ...successorsCumulatedPriorities];
      const numberPriorities = priorities.map((pr) => PriorityEnum[pr]);
      const maxNumberPriority = Math.max(...numberPriorities);
      return PriorityEnum[maxNumberPriority] as Priority;
    },
});

const nextTaskState = selector<TaskId>({
  key: "NextTask",
  get: ({ get }) => {
    const tasks = get(tasksWithoutPredecessorState);
    const sortedTasks = tasks
      .map((id) => ({
        id,
        priority: get(cumulatedTaskPriorityStateFamily(id)),
      }))
      .sort(compareByPriority);
    return sortedTasks.length === 0 ? "NO-TASK-FOUND" : sortedTasks[0].id;
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
  taskSuccessorsStateFamily,
  cumulatedTaskPriorityStateFamily,
  nextTaskState,
};
