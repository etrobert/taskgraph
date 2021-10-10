import without from "../../_snowpack/pkg/lodash/without.js";
import {useRecoilCallback} from "../../_snowpack/pkg/recoil.js";
import {selectedElementsState} from "../atoms.js";
const useSetTaskSelected = () => useRecoilCallback(({set}) => (id, selected) => set(selectedElementsState, ({tasks, dependencies}) => ({
  dependencies,
  tasks: selected ? [...tasks, id] : without(tasks, id)
})), []);
export default useSetTaskSelected;
