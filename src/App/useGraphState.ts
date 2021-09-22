import { useRecoilCallback, useRecoilTransaction_UNSTABLE } from "recoil";
import difference from "lodash/difference";

import {
  dependencyStateFamily,
  projectState,
  selectedTasksState,
  taskStateFamily,
} from "@/atoms";

type UseGraphState = () => {
  addTask: (name: string) => void;
  clearGraph: () => void;
  completeSelected: () => void;
  deleteSelected: () => void;
};

// TODO Use a real unique id generator
const generateNewId = () => (Math.random() * 1000).toString();

const useGraphState: UseGraphState = () => {
  const addTask = useRecoilCallback(({ set }) =>
    // TODO Allow to give more data than just name (position, status)
    (name: string) => {
      const id = generateNewId();
      set(taskStateFamily(id), {
        name,
        position: { x: 0, y: 0 },
        status: "ready",
      } as const);
      set(projectState, (project) => ({
        ...project,
        tasks: [...project.tasks, id],
      }));
    }
  );

  const clearGraph = useRecoilCallback(
    ({ set }) =>
      () =>
        set(projectState, { tasks: [], dependencies: [] }),
    []
  );

  const deleteSelected = useRecoilTransaction_UNSTABLE(
    ({ get, set }) =>
      () => {
        const selectedTasks = get(selectedTasksState);

        set(projectState, (project) => ({
          ...project,
          tasks: difference(project.tasks, selectedTasks),
          dependencies: project.dependencies.filter((dep) => {
            const { predecessor, successor } = get(dependencyStateFamily(dep));

            // None of the selected tasks are the predecessor or the successor
            return !selectedTasks.some(
              (task) => task === predecessor || task === successor
            );
          }),
        }));
      },
    []
  );

  const completeSelected = useRecoilTransaction_UNSTABLE(
    ({ get, set }) =>
      () => {
        const selectedTasks = get(selectedTasksState);

        selectedTasks.forEach((taskId) =>
          set(taskStateFamily(taskId), (task) => ({
            ...task,
            status:
              task.status === "ready"
                ? ("completed" as const)
                : ("ready" as const),
          }))
        );
      }
  );

  return { addTask, clearGraph, completeSelected, deleteSelected };
};

export default useGraphState;
