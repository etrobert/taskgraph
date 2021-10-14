import {atom, atomFamily, selector, selectorFamily} from "../_snowpack/pkg/recoil.js";
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
const selectedElementsState = atom({
  key: "SelectedElements",
  default: {tasks: [], dependencies: []}
});
const anyElementsSelectedState = selector({
  key: "AnyElementsSelected",
  get: ({get}) => get(selectedElementsState).tasks.length !== 0 || get(selectedElementsState).dependencies.length !== 0
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
const drawModeState = atom({
  key: "DrawMode",
  default: false
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
  drawModeState
};
