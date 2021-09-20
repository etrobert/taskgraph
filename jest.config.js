module.exports = {
  preset: "ts-jest",
  moduleNameMapper: {
    "@/(.*)$": "<rootDir>/src/$1",
    "^.+\\.(css|less)$": "<rootDir>/src/__mocks__/css.ts",
  },
};
