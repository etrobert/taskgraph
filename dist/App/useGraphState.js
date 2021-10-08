import {useRecoilCallback} from "../../_snowpack/pkg/recoil.js";
import {projectState, taskStateFamily} from "../atoms.js";
const useGraphState = () => {
  const addTask = useRecoilCallback(({set}) => (id, task) => {
    set(taskStateFamily(id), task);
    set(projectState, (project) => ({
      ...project,
      tasks: [...project.tasks, id]
    }));
  }, []);
  const setTask = useRecoilCallback(({set}) => (id, task) => set(taskStateFamily(id), task), []);
  const removeTask = useRecoilCallback(({set}) => (id) => set(projectState, (project) => ({
    ...project,
    tasks: project.tasks.filter((currentId) => currentId !== id)
  })), []);
  const clearGraph = useRecoilCallback(({set}) => () => set(projectState, {tasks: [], dependencies: []}), []);
  return {addTask, setTask, removeTask, clearGraph};
};
export default useGraphState;
