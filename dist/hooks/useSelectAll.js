import {useRecoilTransaction_UNSTABLE} from "../../_snowpack/pkg/recoil.js";
import {Set} from "../../_snowpack/pkg/immutable.js";
import {selectedElementsState, workspaceState} from "../atoms.js";
const useSelectAll = () => useRecoilTransaction_UNSTABLE(({get, set}) => () => {
  const {tasks, dependencies} = get(workspaceState);
  set(selectedElementsState, {
    tasks: Set(tasks),
    dependencies: Set(dependencies)
  });
}, []);
export default useSelectAll;
