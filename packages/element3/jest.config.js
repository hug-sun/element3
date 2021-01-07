module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['./scripts/setupJestEnv.js'],
  roots: ['<rootDir>/src', '<rootDir>/packages', '<rootDir>/tests'],
  transform: {
    '^.+\\.vue$': 'vue-jest',
    '^.+\\js$': 'babel-jest'
  },
  moduleFileExtensions: ['vue', 'js', 'json', 'jsx', 'ts', 'tsx', 'node'],
  testMatch: [
    '**/tests/**/?(*.)+(test).[jt]s?(x)',
    '**/tests/**/*spec.[jt]s?(x)',
    '**/__tests__/**/*.spec.js'
  ],
  moduleNameMapper: {
    '^element-ui(.*)$': '<rootDir>$1',
    '^main(.*)$': '<rootDir>/src$1',
    '^lodash-es$': 'lodash'
  },
  transformIgnorePatterns: ['<rootDir>/node_modules/(?!lodash-es)']
}
