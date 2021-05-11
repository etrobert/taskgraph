import { deleteSelected, selectAll } from "@/graph";
import { saveToFile, saveToLocalStorage } from "@/storage";
import useKeyboardShortcuts, { Shortcut } from "@/useKeyboardShortcuts";

type Props = {
  loadFromFile: () => void;
  insertMode: boolean;
  openNewTask: () => void;
};

const getAppShortcuts = ({ loadFromFile, openNewTask }: Props) => {
  const selectAllShortcut: Shortcut = {
    keys: ["a"],
    callback: (event) => {
      if (event.ctrlKey) selectAll();
    },
  };

  const insert = {
    keys: ["i"],
    callback: openNewTask,
  };

  const deleteSelectedShortcut = {
    keys: ["d", "Delete"],
    callback: () => {
      deleteSelected();
      saveToLocalStorage();
    },
  };

  const openFile: Shortcut = {
    keys: ["o"],
    callback: (event) => {
      if (event.ctrlKey) loadFromFile();
    },
  };

  const saveFile: Shortcut = {
    keys: ["s"],
    callback: (event) => {
      if (event.ctrlKey) saveToFile();
    },
  };

  return {
    selectAll: selectAllShortcut,
    insert,
    delete: deleteSelectedShortcut,
    openFile,
    saveFile,
  };
};

const useAppShortcuts = (props: Props): void => {
  const { insertMode } = props;

  useKeyboardShortcuts(insertMode ? {} : getAppShortcuts(props));
};

export default useAppShortcuts;
