module.exports = {
  testEnvironment: 'node',
  testMatch: ['<rootDir>/tests/**/*.test.js'],
  setupFiles: ['<rootDir>/tests/setupEnv.js'],
  clearMocks: true,
  restoreMocks: true,
  collectCoverageFrom: ['src/**/*.js', '!src/server.js', '!src/config/swagger.js'],
};
