import { useEffect } from "react";

type Shortcut = {
  keys: string[];
  callback: (event: KeyboardEvent) => void;
};

type Shortcuts = Partial<Record<string, Shortcut>>;

const useKeyboardShortcuts = (shortcuts: Shortcuts): void => {
  const handler = (event: KeyboardEvent) => {
    Object.values(shortcuts).forEach((shortcut) => {
      if (!shortcut) return;
      const { keys, callback } = shortcut;
      if (keys.includes(event.key)) callback(event);
    });
  };
  useEffect(() => {
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keyup", handler);
  });
};

export default useKeyboardShortcuts;

export type { Shortcut };
