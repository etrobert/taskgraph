import {useRecoilCallback} from "../../_snowpack/pkg/recoil.js";
import {selectedElementsState} from "../atoms.js";
const useSetTaskSelected = () => useRecoilCallback(({set}) => (id, selected) => set(selectedElementsState, ({tasks, dependencies}) => ({
  dependencies,
  tasks: selected ? tasks.add(id) : tasks.remove(id)
})), []);
export default useSetTaskSelected;
