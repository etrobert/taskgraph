import {useEffect} from "../../_snowpack/pkg/react.js";
const useKeyboardShortcuts = (shortcuts) => {
  const handler = (event) => {
    Object.values(shortcuts).forEach((shortcut) => {
      if (!shortcut)
        return;
      const {keys, callback} = shortcut;
      if (keys.includes(event.key))
        callback(event);
    });
  };
  useEffect(() => {
    document.addEventListener("keyup", handler);
    return () => document.removeEventListener("keyup", handler);
  });
};
export default useKeyboardShortcuts;
