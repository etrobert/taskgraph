import React, { useState } from "react";
import ThemeContext from "./ThemeContext";
import themes from "./themes";

type Props = {
  children: React.ReactNode;
};

const ThemeProvider = ({ children }: Props): JSX.Element => {
  const [theme, setTheme] = useState(themes.dark.theme);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme: (newTheme: typeof theme) => setTheme(newTheme),
      }}
    >
      <div style={{ ...theme, height: "100%" }}>{children}</div>
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
