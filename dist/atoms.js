import {atom, atomFamily, selector, selectorFamily} from "../_snowpack/pkg/recoil.js";
import {Set} from "../_snowpack/pkg/immutable.js";
import compareByPriority from "./compareByPriority.js";
import PriorityEnum from "./PriorityEnum.js";
const authState = atom({
  key: "Auth",
  default: {status: "loading"}
});
const signedInUserIdState = selector({
  key: "SignedInUserId",
  get: ({get}) => {
    const auth = get(authState);
    return auth.status === "signedIn" ? auth.userId : "NOT_SIGNED_IN";
  }
});
const insertModeState = atom({
  key: "InsertMode",
  default: false
});
const taskStateFamily = atomFamily({
  key: "Task",
  default: {
    name: "DEFAULT-TASK-NAME",
    position: {x: 0, y: 0},
    status: "ready"
  }
});
const dependencyStateFamily = atomFamily({
  key: "Dependency",
  default: {
    predecessor: "DEFAULT-TASK-ID",
    successor: "DEFAULT-TASK-ID"
  }
});
const workspaceState = atom({
  key: "Workspace",
  default: {
    tasks: [],
    dependencies: []
  }
});
const taskIsInWorkspaceStateFamily = selectorFamily({
  key: "TaskIsInWorkspace",
  get: (id) => ({get}) => get(workspaceState).tasks.includes(id)
});
const selectedElementsState = atom({
  key: "SelectedElements",
  default: {tasks: Set(), dependencies: Set()}
});
const anyElementsSelectedState = selector({
  key: "AnyElementsSelected",
  get: ({get}) => get(selectedElementsState).tasks.size !== 0 || get(selectedElementsState).dependencies.size !== 0
});
const taskSelectedStateFamily = selectorFamily({
  key: "TaskSelected",
  get: (id) => ({get}) => get(selectedElementsState).tasks.includes(id)
});
const workspaceDependenciesState = selector({
  key: "WorkspaceDependencies",
  get: ({get}) => get(workspaceState).dependencies.map((id) => ({
    id,
    ...get(dependencyStateFamily(id))
  }))
});
const workspaceTasksState = selector({
  key: "WorkspaceTasks",
  get: ({get}) => get(workspaceState).tasks.map((id) => ({
    id,
    ...get(taskStateFamily(id))
  }))
});
const tasksWithoutPredecessorState = selector({
  key: "TasksWithoutPredecessor",
  get: ({get}) => {
    const {tasks, dependencies} = get(workspaceState);
    return tasks.filter((taskId) => !dependencies.some((depId) => get(dependencyStateFamily(depId)).successor === taskId));
  }
});
const taskSuccessorsStateFamily = selectorFamily({
  key: "TaskSuccessors",
  get: (id) => ({get}) => get(workspaceDependenciesState).filter((dep) => dep.predecessor === id).map((dep) => dep.successor)
});
const cumulatedTaskPriorityStateFamily = selectorFamily({
  key: "CumulatedTaskPriority",
  get: (id) => ({get}) => {
    const myPriority = get(taskStateFamily(id)).priority ?? "normal";
    const successors = get(taskSuccessorsStateFamily(id));
    const successorsCumulatedPriorities = successors.map((succId) => get(cumulatedTaskPriorityStateFamily(succId)));
    const priorities = [myPriority, ...successorsCumulatedPriorities];
    const numberPriorities = priorities.map((pr) => PriorityEnum[pr]);
    const maxNumberPriority = Math.max(...numberPriorities);
    return PriorityEnum[maxNumberPriority];
  }
});
const nextTaskState = selector({
  key: "NextTask",
  get: ({get}) => {
    const tasks = get(tasksWithoutPredecessorState);
    const sortedTasks = tasks.map((id) => ({
      id,
      priority: get(cumulatedTaskPriorityStateFamily(id))
    })).sort(compareByPriority);
    return sortedTasks.length === 0 ? "NO-TASK-FOUND" : sortedTasks[0].id;
  }
});
const isNextTaskStateFamily = selectorFamily({
  key: "IsNextTask",
  get: (id) => ({get}) => get(nextTaskState) === id
});
export {
  authState,
  signedInUserIdState,
  insertModeState,
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
  isNextTaskStateFamily
};
