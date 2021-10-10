import {dependencyStateFamily, projectState} from "./atoms.js";
const getRelatedDependencies = (get, taskId) => {
  const {dependencies} = get(projectState);
  const fullDependencies = dependencies.map((id) => ({
    id,
    ...get(dependencyStateFamily(id))
  }));
  const related = fullDependencies.filter((dep) => dep.predecessor === taskId || dep.successor === taskId);
  return related.map(({id}) => id);
};
export default getRelatedDependencies;
