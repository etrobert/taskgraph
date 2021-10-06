import useKeyboardShortcuts from "../useKeyboardShortcuts.js";
const selectAll = () => {
};
const getAppShortcuts = ({onCreateTask, onDelete}) => {
  const selectAllShortcut = {
    keys: ["a"],
    callback: (event) => {
      if (event.ctrlKey)
        selectAll();
    }
  };
  const insert = {
    keys: ["i"],
    callback: onCreateTask
  };
  const deleteSelectedShortcut = {
    keys: ["d", "Delete"],
    callback: onDelete
  };
  return {
    selectAll: selectAllShortcut,
    insert,
    delete: deleteSelectedShortcut
  };
};
const useAppShortcuts = (props) => {
  const {insertMode} = props;
  useKeyboardShortcuts(insertMode ? {} : getAppShortcuts(props));
};
export default useAppShortcuts;
