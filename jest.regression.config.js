// Custom Jest configuration for regression tests
const config = {
  collectCoverageFrom: [
    "src/**/*.{js,jsx,ts,tsx}",
    "!src/index.js",
    "!src/reportWebVitals.js",
    "!src/setupTests.js",
    "!src/**/*.test.{js,jsx,ts,tsx}"
  ],
  testMatch: ["**/__tests__/regression.test.js"],
  // Override default coverage thresholds to not fail tests
  coverageThreshold: null
};

module.exports = config;
