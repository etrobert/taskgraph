import { useRecoilCallback } from "recoil";

import { projectState, Task, taskStateFamily } from "@/atoms";

type UseGraphState = () => {
  addTask: (task: Task) => void;
  clearGraph: () => void;
};

// TODO Use a real unique id generator
const generateNewId = () => (Math.random() * 1000).toString();

const useGraphState: UseGraphState = () => {
  const addTask = useRecoilCallback(
    ({ set }) =>
      // TODO Allow to give more data than just name (position, status)
      (task: Task) => {
        const id = generateNewId();
        set(taskStateFamily(id), task);
        set(projectState, (project) => ({
          ...project,
          tasks: [...project.tasks, id],
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

  return { addTask, clearGraph };
};

export default useGraphState;
