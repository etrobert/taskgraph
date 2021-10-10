import { RecoilValue } from "recoil";
import { dependencyStateFamily, projectState } from "./atoms";
import { TaskId } from "./types";

/**
 * Returns the dependencies that have taskId as successor or predecessor
 *
 * This should be a selector but useRecoilTransaction does not support selectors yet
 */
const getRelatedDependencies = (
  get: <T>(a: RecoilValue<T>) => T,
  taskId: TaskId
): TaskId[] => {
  const { dependencies } = get(projectState);

  const fullDependencies = dependencies.map((id) => ({
    id,
    ...get(dependencyStateFamily(id)),
  }));

  const related = fullDependencies.filter(
    (dep) => dep.predecessor === taskId || dep.successor === taskId
  );

  return related.map(({ id }) => id);
};

export default getRelatedDependencies;
