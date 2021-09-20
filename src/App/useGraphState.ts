import { useRecoilCallback } from "recoil";

import { projectState, Task, TaskId, taskStateFamily } from "@/atoms";

type UseGraphState = () => {
  addTask: (id: TaskId, task: Task) => void;
  setTask: (id: TaskId, task: Task) => void;
  removeTask: (id: TaskId) => void;
  clearGraph: () => void;
};

const useGraphState: UseGraphState = () => {
  const addTask = useRecoilCallback(
    ({ set }) =>
      (id: TaskId, task: Task) => {
        set(taskStateFamily(id), task);
        set(projectState, (project) => ({
          ...project,
          tasks: [...project.tasks, id],
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
      (id: TaskId) =>
        set(projectState, (project) => ({
          ...project,
          tasks: project.tasks.filter((currentId) => currentId !== id),
        })),
    []
  );

  const clearGraph = useRecoilCallback(
    ({ set }) =>
      () =>
        set(projectState, { tasks: [], dependencies: [] }),
    []
  );

  return { addTask, setTask, removeTask, clearGraph };
};

export default useGraphState;
