import { loadFromFile, saveToFile, saveToLocalStorage } from ".";
import { deleteSelected, selectAll } from "./graph";
import { getElementById } from "./misc";
import useKeyboardShortcut from "./useKeyboardShortcut";

// TODO Extract the newTask check into a disabled boolean prop
const useAppShortcuts = () => {
  useKeyboardShortcut(["a"], (event) => {
    const newTask = getElementById("newTask");
    if (newTask.style.display === "block") return;
    if (event.ctrlKey) selectAll();
  });

  useKeyboardShortcut(["i"], () => {
    const newTask = getElementById("newTask");
    if (newTask.style.display === "block") return;
    newTask.style.display = "block";
    newTask.focus();
  });

  useKeyboardShortcut(["d", "Delete"], () => {
    const newTask = getElementById("newTask");
    if (newTask.style.display === "block") return;
    deleteSelected();
    saveToLocalStorage();
  });

  useKeyboardShortcut(["o"], (event) => {
    const newTask = getElementById("newTask");
    if (newTask.style.display === "block") return;
    if (event.ctrlKey) loadFromFile();
  });

  useKeyboardShortcut(["s"], (event) => {
    const newTask = getElementById("newTask");
    if (newTask.style.display === "block") return;
    if (event.ctrlKey) saveToFile();
  });
};

export default useAppShortcuts;
