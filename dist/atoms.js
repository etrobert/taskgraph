import {atom, atomFamily, selector, selectorFamily} from "../snowpack/pkg/recoil.js";
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
const selectedTasksState = atom({
  key: "SelectedTasks",
  default: []
});
const anyTasksSelectedSelector = selector({
  key: "AnyTaskSelected",
  get: ({get}) => get(selectedTasksState).length !== 0
});
const taskSelectedSelectorFamily = selectorFamily({
  key: "TaskSelected",
  get: (id) => ({get}) => get(selectedTasksState).includes(id)
});
const projectDependenciesSelector = selector({
  key: "ProjectDependencies",
  get: ({get}) => get(projectState).dependencies.map((dep) => get(dependencyStateFamily(dep)))
});
const projectTasksSelector = selector({
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
  selectedTasksState,
  anyTasksSelectedSelector,
  taskSelectedSelectorFamily,
  projectDependenciesSelector,
  projectTasksSelector,
  drawModeState
};
