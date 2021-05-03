module.exports = {
  preset: "ts-jest",
  moduleNameMapper: {
    "^.+\\.(css|less)$": "<rootDir>/src/scripts/__mocks__/css.ts",
  },
};
