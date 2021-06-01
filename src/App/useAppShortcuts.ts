import { selectAll } from "@/graph";
import { saveToFile } from "@/storage";
import useKeyboardShortcuts, { Shortcut } from "@/useKeyboardShortcuts";

type Props = {
  loadFromFile: () => void;
  insertMode: boolean;
  onCreateTask: () => void;
  onDelete: () => void;
};

const getAppShortcuts = ({ loadFromFile, onCreateTask, onDelete }: Props) => {
  const selectAllShortcut: Shortcut = {
    keys: ["a"],
    callback: (event) => {
      if (event.ctrlKey) selectAll();
    },
  };

  const insert = {
    keys: ["i"],
    callback: onCreateTask,
  };

  const deleteSelectedShortcut = {
    keys: ["d", "Delete"],
    callback: onDelete,
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
