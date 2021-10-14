import { useRecoilCallback } from "recoil";
import without from "lodash/without";

import {
  dependencyStateFamily,
  workspaceState,
  selectedElementsState,
  taskStateFamily,
} from "@/atoms";

import type { Dependency, DependencyId, Task, TaskId } from "@/types";

type UseGraphState = () => {
  addTask: (id: TaskId, task: Task) => void;
  setTask: (id: TaskId, task: Task) => void;
  removeTask: (id: TaskId) => void;
  addDependency: (id: DependencyId, dependency: Dependency) => void;
  removeDependency: (id: DependencyId) => void;
  clearGraph: () => void;
};

const useGraphState: UseGraphState = () => {
  const addTask = useRecoilCallback(
    ({ set }) =>
      (id: TaskId, task: Task) => {
        set(taskStateFamily(id), task);
        set(workspaceState, (workspace) => ({
          ...workspace,
          tasks: [...workspace.tasks, id],
        }));
      },
    []
  );

  const setTask = useRecoilCallback(
    ({ set }) =>
      (id: TaskId, task: Task) =>
        set(taskStateFamily(id), task),
    []
  );

  const removeTask = useRecoilCallback(
    ({ set }) =>
      (id: TaskId) => {
        set(workspaceState, (workspace) => ({
          ...workspace,
          tasks: workspace.tasks.filter((currentId) => currentId !== id),
        }));
        // Remove task from the selected elements
        set(selectedElementsState, ({ tasks, dependencies }) => ({
          dependencies,
          tasks: without(tasks, id),
        }));
      },
    []
  );

  const clearGraph = useRecoilCallback(
    ({ set }) =>
      () =>
        set(workspaceState, { tasks: [], dependencies: [] }),
    []
  );

  const addDependency = useRecoilCallback(
    ({ set }) =>
      (id: DependencyId, dependency: Dependency) => {
        set(dependencyStateFamily(id), dependency);
        set(workspaceState, (workspace) => ({
          ...workspace,
          dependencies: [...workspace.dependencies, id],
        }));
      },
    []
  );

  const removeDependency = useRecoilCallback(
    ({ set }) =>
      (id: DependencyId) => {
        set(workspaceState, (workspace) => ({
          ...workspace,
          dependencies: without(workspace.dependencies, id),
        }));
        // Remove task from the selected elements
        set(selectedElementsState, ({ tasks, dependencies }) => ({
          tasks,
          dependencies: without(dependencies, id),
        }));
      },
    []
  );

  return {
    addTask,
    setTask,
    removeTask,
    addDependency,
    removeDependency,
    clearGraph,
  };
};

export default useGraphState;
