import { selectAll } from "@/graph";
import useKeyboardShortcuts, { Shortcut } from "@/useKeyboardShortcuts";

type Props = {
  insertMode: boolean;
  onCreateTask: () => void;
  onDelete: () => void;
};

const getAppShortcuts = ({ onCreateTask, onDelete }: Props) => {
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

  return {
    selectAll: selectAllShortcut,
    insert,
    delete: deleteSelectedShortcut,
  };
};

const useAppShortcuts = (props: Props): void => {
  const { insertMode } = props;

  useKeyboardShortcuts(insertMode ? {} : getAppShortcuts(props));
};

export default useAppShortcuts;
