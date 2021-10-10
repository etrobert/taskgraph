import without from "../../_snowpack/pkg/lodash/without.js";
import {useRecoilCallback} from "../../_snowpack/pkg/recoil.js";
import {selectedElementsState} from "../atoms.js";
const useSetDependencySelected = () => useRecoilCallback(({set}) => (id, selected) => set(selectedElementsState, ({tasks, dependencies}) => ({
  tasks,
  dependencies: selected ? [...dependencies, id] : without(dependencies, id)
})), []);
export default useSetDependencySelected;
