import { loadFromFile, saveToFile, saveToLocalStorage } from ".";
import { deleteSelected, selectAll } from "./graph";
import { getElementById } from "./misc";
import useKeyboardShortcut from "./useKeyboardShortcut";

const insertMode = () => {
  const newTask = getElementById("newTask");
  return newTask.style.display === "block";
};

// TODO Conditionally activate or disable the shortcuts rather than having them test insert mode
const useAppShortcuts = (): void => {
  useKeyboardShortcut(["a"], (event) => {
    if (insertMode()) return;
    if (event.ctrlKey) selectAll();
  });

  useKeyboardShortcut(["i"], () => {
    if (insertMode()) return;
    const newTask = getElementById("newTask");
    newTask.style.display = "block";
    newTask.focus();
  });

  useKeyboardShortcut(["d", "Delete"], () => {
    if (insertMode()) return;
    deleteSelected();
    saveToLocalStorage();
  });

  useKeyboardShortcut(["o"], (event) => {
    if (insertMode()) return;
    if (event.ctrlKey) loadFromFile();
  });

  useKeyboardShortcut(["s"], (event) => {
    if (insertMode()) return;
    if (event.ctrlKey) saveToFile();
  });
};

export default useAppShortcuts;
