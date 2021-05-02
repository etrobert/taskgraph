import { useEffect } from "react";

const useKeyboardShortcut = (
  shortcutKeys: string[],
  callback: (event: KeyboardEvent) => void
): void => {
  const handler = (event: KeyboardEvent) => {
    if (shortcutKeys.includes(event.key)) callback(event);
  };
  useEffect(() => {
    document.addEventListener("keyup", handler);
    return () => document.removeEventListener("keyup", handler);
  });
};

export default useKeyboardShortcut;
