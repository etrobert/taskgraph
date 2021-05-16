module.exports = {
  preset: "ts-jest",
  moduleNameMapper: {
    "^.+\\.(css|less)$": "<rootDir>/src/__mocks__/css.ts",
  },
};
