import { useRecoilCallback } from "recoil";

import {
  Dependency,
  dependencyStateFamily,
  projectState,
  taskStateFamily,
} from "@/atoms";

type UseGraphState = () => {
  addTask: (name: string) => void;
  addDependency: (dependency: Dependency) => void;
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
      set(projectState, (project) => ({
        ...project,
        tasks: [...project.tasks, id],
      }));
    }
  );

  const addDependency = useRecoilCallback(
    ({ set }) =>
      (dependency: Dependency) => {
        const id = generateNewId();
        set(dependencyStateFamily(id), dependency);
        set(projectState, (project) => ({
          ...project,
          dependencies: [...project.dependencies, id],
        }));
      }
  );

  const clearGraph = useRecoilCallback(
    ({ set }) =>
      () =>
        set(projectState, { tasks: [], dependencies: [] }),
    []
  );
  return { addTask, addDependency, clearGraph };
};

export default useGraphState;
