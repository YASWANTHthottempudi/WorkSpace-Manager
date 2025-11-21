export default {
  testEnvironment: 'node',
  transform: {},
  moduleFileExtensions: ['js', 'json'],
  testMatch: ['**/tests/**/*.test.js'],
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/server.js',
  ],
  coverageDirectory: 'coverage',
  verbose: true,
  testTimeout: 10000,
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  transformIgnorePatterns: [],
  // Mock isomorphic-dompurify for tests
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
    '^isomorphic-dompurify$': '<rootDir>/tests/__mocks__/isomorphic-dompurify.js',
  },
};
