import {useRecoilCallback} from "../../_snowpack/pkg/recoil.js";
import without from "../../_snowpack/pkg/lodash/without.js";
import {
  dependencyStateFamily,
  workspaceState,
  selectedElementsState,
  taskStateFamily
} from "../atoms.js";
const useGraphState = () => {
  const addTask = useRecoilCallback(({set}) => (id, task) => {
    set(taskStateFamily(id), task);
    set(workspaceState, (workspace) => ({
      ...workspace,
      tasks: [...workspace.tasks, id]
    }));
  }, []);
  const setTask = useRecoilCallback(({set}) => (id, task) => set(taskStateFamily(id), task), []);
  const removeTask = useRecoilCallback(({set}) => (id) => {
    set(workspaceState, (workspace) => ({
      ...workspace,
      tasks: workspace.tasks.filter((currentId) => currentId !== id)
    }));
    set(selectedElementsState, ({tasks, dependencies}) => ({
      dependencies,
      tasks: tasks.remove(id)
    }));
  }, []);
  const clearGraph = useRecoilCallback(({set}) => () => set(workspaceState, {tasks: [], dependencies: []}), []);
  const addDependency = useRecoilCallback(({set}) => (id, dependency) => {
    set(dependencyStateFamily(id), dependency);
    set(workspaceState, (workspace) => ({
      ...workspace,
      dependencies: [...workspace.dependencies, id]
    }));
  }, []);
  const removeDependency = useRecoilCallback(({set}) => (id) => {
    set(workspaceState, (workspace) => ({
      ...workspace,
      dependencies: without(workspace.dependencies, id)
    }));
    set(selectedElementsState, ({tasks, dependencies}) => ({
      tasks,
      dependencies: dependencies.remove(id)
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
