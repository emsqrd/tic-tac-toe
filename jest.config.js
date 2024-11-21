module.exports = {
  preset: "jest-preset-angular",
  setupFilesAfterEnv: ["<rootDir>/setup-jest.ts"],
  globalSetup: "jest-preset-angular/global-setup",
  moduleNameMapper: {
    "^src/(.*)$": "<rootDir>/src/$1",
  },
  collectCoverageFrom: [
    "<rootDir>/src/**/*.ts",
    "!<rootDir>/src/**/*.spec.ts",
    "!<rootDir>/src/**/index.ts",
    "!<rootDir>/src/main.ts",
    "!<rootDir>/src/polyfills.ts",
  ],
  coverageDirectory: "coverage",
  coverageReporters: ["html", "lcov", "text-summary"],
};
