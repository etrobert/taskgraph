import {atom, atomFamily, selector, selectorFamily} from "../_snowpack/pkg/recoil.js";
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
const projectIdState = atom({
  key: "ProjectId",
  default: "spXxYVulTgfKcj0n1sWb"
});
const projectState = atom({
  key: "Project",
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
const projectDependenciesState = selector({
  key: "ProjectDependencies",
  get: ({get}) => get(projectState).dependencies.map((id) => ({
    id,
    ...get(dependencyStateFamily(id))
  }))
});
const projectTasksState = selector({
  key: "ProjectTasks",
  get: ({get}) => get(projectState).tasks.map((id) => ({id, ...get(taskStateFamily(id))}))
});
const drawModeState = atom({
  key: "DrawMode",
  default: false
});
export {
  projectIdState,
  projectState,
  dependencyStateFamily,
  taskStateFamily,
  selectedElementsState,
  anyElementsSelectedState,
  taskSelectedStateFamily,
  projectDependenciesState,
  projectTasksState,
  drawModeState
};
