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
const taskSelectedSelectorFamily = selectorFamily({
  key: "TaskSelected",
  get: (id) => ({get}) => get(selectedTasksState).includes(id)
});
const projectDependenciesSelector = selector({
  key: "ProjectDependencies",
  get: ({get}) => get(projectState).dependencies.map((dep) => get(dependencyStateFamily(dep)))
});
export {
  projectIdState,
  projectState,
  dependencyStateFamily,
  taskStateFamily,
  selectedTasksState,
  taskSelectedSelectorFamily,
  projectDependenciesSelector
};
