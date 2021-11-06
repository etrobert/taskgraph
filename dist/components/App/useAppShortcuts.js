import {useRecoilState} from "../../../_snowpack/pkg/recoil.js";
import {insertModeState} from "../../atoms.js";
import useFirestoreState from "../../hooks/useFirestoreState.js";
import useKeyboardShortcuts from "../../hooks/useKeyboardShortcuts.js";
import useSelectAll from "../../hooks/useSelectAll.js";
const useAppShortcuts = () => {
  const selectAll = useSelectAll();
  const {deleteSelected} = useFirestoreState();
  const [insertMode, setInsertMode] = useRecoilState(insertModeState);
  const insert = {
    keys: ["i"],
    callback: () => setInsertMode(true)
  };
  const deleteSelectedShortcut = {
    keys: ["d", "Delete"],
    callback: deleteSelected
  };
  const selectAllShortcut = {
    keys: ["a"],
    callback: (event) => {
      if (!event.ctrlKey)
        return;
      event.preventDefault();
      selectAll();
    }
  };
  const shortcuts = {
    insert,
    deleteSelected: deleteSelectedShortcut
  };
  useKeyboardShortcuts(insertMode ? {} : shortcuts);
};
export default useAppShortcuts;
