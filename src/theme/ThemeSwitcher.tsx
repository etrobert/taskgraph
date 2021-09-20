import React, { useContext } from "react";
import ThemeContext from "./ThemeContext";
import themeDefinitions from "./themes";
const themes = Object.values(themeDefinitions);

const ThemeSwitcher = () => {
  const { setTheme } = useContext(ThemeContext);

  return (
    <ul style={{ display: "flex", justifyContent: "space-between" }}>
      {themes.map((item) => (
        <li key={item.title}>
          <button
            style={{
              boxShadow:
                "0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)",
              width: "100%",
              padding: "0.5rem",
              color: item.theme["--task-color"],
              background: item.theme["--task-background-color"],
              borderRadius: "0.25rem",
              border: `1px solid ${item.theme["--task-color"]}`,
            }}
            type="button"
            onClick={() => setTheme(item.theme)}
          >
            {item.title}
          </button>
        </li>
      ))}
    </ul>
  );
};

export default ThemeSwitcher;
