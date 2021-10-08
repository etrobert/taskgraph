import {
  getBoxCenter,
  getExpandedBox,
  intersectLineBox
} from "./geometry.js";
import {atom, atomFamily, selectorFamily} from "../snowpack/pkg/recoil.js";
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
const taskBoxSizeStateFamily = atomFamily({
  key: "TaskBoxSize",
  default: {
    width: 0,
    height: 0
  }
});
const taskBoxSelectorFamily = selectorFamily({
  key: "TaskExtendedBoudingBox",
  get: (id) => ({get}) => {
    const {width, height} = get(taskBoxSizeStateFamily(id));
    const {
      position: {x, y}
    } = get(taskStateFamily(id));
    return {
      left: x,
      right: x + width,
      top: y,
      bottom: y + height,
      width,
      height
    };
  }
});
const taskCenterSelectorFamily = selectorFamily({
  key: "TaskCenter",
  get: (id) => ({get}) => {
    const box = get(taskBoxSelectorFamily(id));
    return getBoxCenter(box);
  }
});
const dependencyPathSelectorFamily = selectorFamily({
  key: "DependencyPath",
  get: (id) => ({get}) => {
    const {predecessor, successor} = get(dependencyStateFamily(id));
    const predecessorCenter = get(taskCenterSelectorFamily(predecessor));
    const successorCenter = get(taskCenterSelectorFamily(successor));
    const offset = 8;
    const predecessorBox = get(taskBoxSelectorFamily(predecessor));
    const expandedPredecessorBox = getExpandedBox(predecessorBox, offset);
    const pathPointPredecessor = intersectLineBox(predecessorCenter, successorCenter, expandedPredecessorBox);
    const successorBox = get(taskBoxSelectorFamily(successor));
    const expandedSuccessorBox = getExpandedBox(successorBox, offset);
    const pathPointSuccessor = intersectLineBox(predecessorCenter, successorCenter, expandedSuccessorBox);
    if (pathPointPredecessor === null || pathPointSuccessor === null)
      return "";
    return `M${pathPointPredecessor.x},${pathPointPredecessor.y}
              L${pathPointSuccessor.x},${pathPointSuccessor.y}`;
  }
});
export {
  projectIdState,
  projectState,
  dependencyStateFamily,
  taskStateFamily,
  taskBoxSizeStateFamily,
  taskBoxSelectorFamily,
  dependencyPathSelectorFamily,
  selectedTasksState,
  taskSelectedSelectorFamily
};
