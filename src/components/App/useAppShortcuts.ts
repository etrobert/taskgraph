import useFirestoreState from "@/hooks/useFirestoreState";
import useKeyboardShortcuts, { Shortcut } from "@/hooks/useKeyboardShortcuts";
import useSelectAll from "@/hooks/useSelectAll";

type Props = { insertMode: boolean; onCreateTask: () => void };

const useAppShortcuts = ({ insertMode, onCreateTask }: Props): void => {
  const selectAll = useSelectAll();
  const { deleteSelected } = useFirestoreState();

  const insert = {
    keys: ["i"],
    callback: onCreateTask,
  };

  const deleteSelectedShortcut = {
    keys: ["d", "Delete"],
    callback: deleteSelected,
  };

  const selectAllShortcut: Shortcut = {
    keys: ["a"],
    callback: (event) => {
      if (!event.ctrlKey) return;
      event.preventDefault();
      selectAll();
    },
  };

  const shortcuts = {
    insert,
    deleteSelected: deleteSelectedShortcut,
    selectAll: selectAllShortcut,
  };

  useKeyboardShortcuts(insertMode ? {} : shortcuts);
};

export default useAppShortcuts;
