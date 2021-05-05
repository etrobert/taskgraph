import { deleteSelected, selectAll } from "@/graph";
import { getElementById } from "@/misc";
import { saveToFile, saveToLocalStorage } from "@/storage";
import useKeyboardShortcuts, { Shortcut } from "@/useKeyboardShortcuts";

const insertMode = () => {
  const newTask = getElementById("newTask");
  return newTask.style.display === "block";
};

// TODO Conditionally activate or disable the shortcuts rather than having them test insert mode
const useAppShortcuts = (loadFromFile: () => void): void => {
  const selectAllShortcut: Shortcut = {
    keys: ["a"],
    callback: (event) => {
      if (insertMode()) return;
      if (event.ctrlKey) selectAll();
    },
  };

  const insert = {
    keys: ["i"],
    callback: () => {
      if (insertMode()) return;
      const newTask = getElementById("newTask");
      newTask.style.display = "block";
      newTask.focus();
    },
  };

  const deleteSelectedShortcut = {
    keys: ["d", "Delete"],
    callback: () => {
      if (insertMode()) return;
      deleteSelected();
      saveToLocalStorage();
    },
  };

  const openFile: Shortcut = {
    keys: ["o"],
    callback: (event) => {
      if (insertMode()) return;
      if (event.ctrlKey) loadFromFile();
    },
  };

  const saveFile: Shortcut = {
    keys: ["s"],
    callback: (event) => {
      if (insertMode()) return;
      if (event.ctrlKey) saveToFile();
    },
  };

  useKeyboardShortcuts({
    selectAll: selectAllShortcut,
    insert,
    delete: deleteSelectedShortcut,
    openFile,
    saveFile,
  });
};

export default useAppShortcuts;
