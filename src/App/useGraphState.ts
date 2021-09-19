import { useRecoilCallback } from "recoil";

import { projectState, Task, TaskId, taskStateFamily } from "@/atoms";

type UseGraphState = () => {
  addTask: (task: Task) => void;
  removeTask: (id: TaskId) => void;
  clearGraph: () => void;
};

const useGraphState: UseGraphState = () => {
  const addTask = useRecoilCallback(
    ({ set }) =>
      // TODO Allow to give more data than just name (position, status)
      (task: Task) => {
        set(taskStateFamily(task.id), task);
        set(projectState, (project) => ({
          ...project,
          tasks: [...project.tasks, task.id],
        }));
      },
    []
  );

  const removeTask = useRecoilCallback(
    ({ set }) =>
      (id: TaskId) => {
        set(graphState, (graph) => ({
          ...graph,
          tasks: graph.tasks.filter((currentId) => currentId !== id),
        }));
      },
    []
  );

  const clearGraph = useRecoilCallback(
    ({ set }) =>
      () =>
        set(projectState, { tasks: [], dependencies: [] }),
    []
  );

  return { addTask, removeTask, clearGraph };
};

export default useGraphState;
