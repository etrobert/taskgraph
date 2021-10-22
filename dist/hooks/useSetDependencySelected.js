import {useRecoilCallback} from "../../_snowpack/pkg/recoil.js";
import {selectedElementsState} from "../atoms.js";
const useSetDependencySelected = () => useRecoilCallback(({set}) => (id, selected) => set(selectedElementsState, ({tasks, dependencies}) => ({
  tasks,
  dependencies: selected ? dependencies.add(id) : dependencies.remove(id)
})), []);
export default useSetDependencySelected;
