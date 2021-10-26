import { useRecoilState } from "recoil";

import { insertModeState } from "@/atoms";
import useFirestoreState from "@/hooks/useFirestoreState";
import useKeyboardShortcuts, { Shortcut } from "@/hooks/useKeyboardShortcuts";
import useSelectAll from "@/hooks/useSelectAll";

const useAppShortcuts = (): void => {
  const selectAll = useSelectAll();
  const { deleteSelected } = useFirestoreState();
  const [insertMode, setInsertMode] = useRecoilState(insertModeState);

  const insert = {
    keys: ["i"],
    callback: () => setInsertMode(true),
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
