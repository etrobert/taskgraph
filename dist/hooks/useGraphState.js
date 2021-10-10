import {useRecoilCallback} from "../../_snowpack/pkg/recoil.js";
import without from "../../_snowpack/pkg/lodash/without.js";
import {
  dependencyStateFamily,
  projectState,
  selectedElementsState,
  taskStateFamily
} from "../atoms.js";
const useGraphState = () => {
  const addTask = useRecoilCallback(({set}) => (id, task) => {
    set(taskStateFamily(id), task);
    set(projectState, (project) => ({
      ...project,
      tasks: [...project.tasks, id]
    }));
  }, []);
  const setTask = useRecoilCallback(({set}) => (id, task) => set(taskStateFamily(id), task), []);
  const removeTask = useRecoilCallback(({set}) => (id) => {
    set(projectState, (project) => ({
      ...project,
      tasks: project.tasks.filter((currentId) => currentId !== id)
    }));
    set(selectedElementsState, ({tasks, dependencies}) => ({
      dependencies,
      tasks: without(tasks, id)
    }));
  }, []);
  const clearGraph = useRecoilCallback(({set}) => () => set(projectState, {tasks: [], dependencies: []}), []);
  const addDependency = useRecoilCallback(({set}) => (id, dependency) => {
    set(dependencyStateFamily(id), dependency);
    set(projectState, (project) => ({
      ...project,
      dependencies: [...project.dependencies, id]
    }));
  }, []);
  const removeDependency = useRecoilCallback(({set}) => (id) => {
    set(projectState, (project) => ({
      ...project,
      dependencies: without(project.dependencies, id)
    }));
    set(selectedElementsState, ({tasks, dependencies}) => ({
      tasks,
      dependencies: without(dependencies, id)
    }));
  }, []);
  return {
    addTask,
    setTask,
    removeTask,
    addDependency,
    removeDependency,
    clearGraph
  };
};
export default useGraphState;
