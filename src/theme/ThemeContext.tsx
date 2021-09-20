import { createContext } from "react";
import themes from "./themes";
import type { Theme } from "./themes";

const ThemeContext = createContext({
  theme: themes.dark.theme,
  setTheme: (newTheme: Theme) => null,
});

export default ThemeContext;
