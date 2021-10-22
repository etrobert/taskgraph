import useFirestoreState from "../../hooks/useFirestoreState.js";
import useKeyboardShortcuts from "../../hooks/useKeyboardShortcuts.js";
import useSelectAll from "../../hooks/useSelectAll.js";
const useAppShortcuts = ({insertMode, onCreateTask}) => {
  const selectAll = useSelectAll();
  const {deleteSelected} = useFirestoreState();
  const insert = {
    keys: ["i"],
    callback: onCreateTask
  };
  const deleteSelectedShortcut = {
    keys: ["d", "Delete"],
    callback: deleteSelected
  };
  const selectAllShortcut = {
    keys: ["a"],
    callback: (event) => {
      if (event.ctrlKey)
        selectAll();
    }
  };
  const shortcuts = {
    insert,
    deleteSelected: deleteSelectedShortcut,
    selectAll: selectAllShortcut
  };
  useKeyboardShortcuts(insertMode ? {} : shortcuts);
};
export default useAppShortcuts;
