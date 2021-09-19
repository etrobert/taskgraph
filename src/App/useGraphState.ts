import { useRecoilCallback } from "recoil";

import { projectState, Task, TaskId, taskStateFamily } from "@/atoms";

type UseGraphState = () => {
  addTask: (task: Task) => void;
  updateTask: (id: TaskId, task: Task) => void;
  removeTask: (id: TaskId) => void;
  clearGraph: () => void;
};

const useGraphState: UseGraphState = () => {
  const addTask = useRecoilCallback(
    ({ set }) =>
      (task: Task) => {
        set(taskStateFamily(task.id), task);
        set(projectState, (project) => ({
          ...project,
          tasks: [...project.tasks, task.id],
        }));
      },
    []
  );

  const updateTask = useRecoilCallback(
    ({ set }) =>
      (id: TaskId, task: Task) =>
        set(taskStateFamily(id), task),
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

  return { addTask, updateTask, removeTask, clearGraph };
};

export default useGraphState;
