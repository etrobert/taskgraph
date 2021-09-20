type Theme = {
  "--task-background-color": string;
  "--task-color": string;

  "--canvas-background-color": string;
  "--dependency-stroke-color": string;
};

export type { Theme };

export default {
  light: {
    title: "Light",
    theme: {
      "--task-background-color": "#ddd",
      "--task-color": "#000",
      "--canvas-background-color": "#ccc",
      "--dependency-stroke-color": "#000",
    },
  },
  dark: {
    title: "Dark",
    theme: {
      "--task-background-color": "#333",
      "--task-color": "#f2ecff",
      "--canvas-background-color": "#666666",
      "--dependency-stroke-color": "#005a34",
    },
  },
  aquatic: {
    title: "Aquatic",
    theme: {
      "--task-background-color": "#0b5c70",
      "--task-color": "#91da7e",
      "--canvas-background-color": "#233444",
      "--dependency-stroke-color": "#f9f871",
    },
  },
  peachy: {
    title: "Peachy",
    theme: {
      "--task-background-color": "#ffcbb6",
      "--task-color": "#0041af",
      "--canvas-background-color": "#ffe7d4",
      "--dependency-stroke-color": "#c59581",
    },
  },
};
