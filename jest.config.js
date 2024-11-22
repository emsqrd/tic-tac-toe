module.exports = {
  preset: "jest-preset-angular",
  setupFilesAfterEnv: ["<rootDir>/src/setup-jest.ts"],
  testPathIgnorePatterns: ["<rootDir>/node_modules/", "<rootDir>/dist/"],
  transform: {
    "^.+\\.(ts|mjs|js|html)$": [
      "jest-preset-angular",
      {
        tsconfig: "<rootDir>/tsconfig.spec.json",
        stringifyContentPathRegex: "\\.html$",
        useESM: true,
      },
    ],
  },
  moduleNameMapper: {
    "^src/(.*)$": "<rootDir>/src/$1",
  },
  collectCoverageFrom: [
    "<rootDir>/src/**/*.ts",
    "!<rootDir>/src/**/*.spec.ts",
    "!<rootDir>/src/**/index.ts",
    "!<rootDir>/src/main.ts",
    "!<rootDir>/src/polyfills.ts",
    "!<rootDir>/src/app/app.config.ts",
    "!<rootDir>/src/app/app.routes.ts",
  ],
  coverageDirectory: "coverage",
  coverageReporters: ["html", "lcov", "text-summary"],
};
