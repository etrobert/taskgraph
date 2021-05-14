import {deleteSelected, selectAll} from "../graph.js";
import {getElementById} from "../misc.js";
import {saveToFile, saveToLocalStorage} from "../storage.js";
import useKeyboardShortcuts from "../useKeyboardShortcuts.js";
const insertMode = () => {
  const newTask = getElementById("newTask");
  return newTask.style.display === "block";
};
const useAppShortcuts = (loadFromFile) => {
  const selectAllShortcut = {
    keys: ["a"],
    callback: (event) => {
      if (insertMode())
        return;
      if (event.ctrlKey)
        selectAll();
    }
  };
  const insert = {
    keys: ["i"],
    callback: () => {
      if (insertMode())
        return;
      const newTask = getElementById("newTask");
      newTask.style.display = "block";
      newTask.focus();
    }
  };
  const deleteSelectedShortcut = {
    keys: ["d", "Delete"],
    callback: () => {
      if (insertMode())
        return;
      deleteSelected();
      saveToLocalStorage();
    }
  };
  const openFile = {
    keys: ["o"],
    callback: (event) => {
      if (insertMode())
        return;
      if (event.ctrlKey)
        loadFromFile();
    }
  };
  const saveFile = {
    keys: ["s"],
    callback: (event) => {
      if (insertMode())
        return;
      if (event.ctrlKey)
        saveToFile();
    }
  };
  useKeyboardShortcuts({
    selectAll: selectAllShortcut,
    insert,
    delete: deleteSelectedShortcut,
    openFile,
    saveFile
  });
};
export default useAppShortcuts;
