import without from "../snowpack/pkg/lodash/without.js";
import {useRecoilCallback} from "../snowpack/pkg/recoil.js";
import {selectedTasksState} from "./atoms.js";
const useSetTaskSelected = () => useRecoilCallback(({set}) => (id, selected) => set(selectedTasksState, (selectedTasks) => selected ? [...selectedTasks, id] : without(selectedTasks, id)), []);
export default useSetTaskSelected;
