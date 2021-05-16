import {deleteSelected, selectAll} from "../graph.js";
import {saveToFile, saveToLocalStorage} from "../storage.js";
import useKeyboardShortcuts from "../useKeyboardShortcuts.js";
const getAppShortcuts = ({loadFromFile, onCreateTask}) => {
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
    callback: () => {
      deleteSelected();
      saveToLocalStorage();
    }
  };
  const openFile = {
    keys: ["o"],
    callback: (event) => {
      if (event.ctrlKey)
        loadFromFile();
    }
  };
  const saveFile = {
    keys: ["s"],
    callback: (event) => {
      if (event.ctrlKey)
        saveToFile();
    }
  };
  return {
    selectAll: selectAllShortcut,
    insert,
    delete: deleteSelectedShortcut,
    openFile,
    saveFile
  };
};
const useAppShortcuts = (props) => {
  const {insertMode} = props;
  useKeyboardShortcuts(insertMode ? {} : getAppShortcuts(props));
};
export default useAppShortcuts;
