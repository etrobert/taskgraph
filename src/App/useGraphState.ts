import { useRecoilCallback } from "recoil";

import { graphState, taskStateFamily } from "@/atoms";

type UseGraphState = () => {
  addTask: (name: string) => void;
  clearGraph: () => void;
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
      set(graphState, (graph) => ({ ...graph, tasks: [...graph.tasks, id] }));
    }
  );

  const clearGraph = useRecoilCallback(
    ({ set }) =>
      () =>
        set(graphState, { tasks: [], dependencies: [] }),
    []
  );
  return { addTask, clearGraph };
};

export default useGraphState;
