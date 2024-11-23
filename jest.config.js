module.exports = {
  preset: "jest-preset-angular",

  // Performance optimizations
  maxWorkers: "50%",
  maxConcurrency: 5,
  cache: true,
  cacheDirectory: "<rootDir>/.jest-cache",
  testTimeout: 10000,

  // Keep existing setup
  collectCoverage: false,
  setupFilesAfterEnv: ["<rootDir>/setup-jest.ts"],
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

  // Simplified coverage config while keeping original reporters
  collectCoverageFrom: [
    "<rootDir>/src/**/*.ts",
    "!<rootDir>/src/**/*.spec.ts",
    "!<rootDir>/src/**/index.ts",
    "!<rootDir>/src/{main,polyfills}.ts",
    "!<rootDir>/src/app/{app.config,app.routes}.ts",
  ],
  coverageDirectory: "coverage",
  coverageReporters: ["html", "lcov", "text-summary"],
};
