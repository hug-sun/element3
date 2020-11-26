module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['./scripts/setupJestEnv.js'],
  roots: ['<rootDir>/src', '<rootDir>/packages', '<rootDir>/test'],
  transform: {
    '^.+\\.vue$': 'vue-jest',
    '^.+\\js$': 'babel-jest'
  },
  moduleFileExtensions: ['vue', 'js', 'json', 'jsx', 'ts', 'tsx', 'node'],
  testMatch: [
    '**/tests/**/?(*.)+(test).[jt]s?(x)',
    '**/__tests__/**/*.spec.js',
    '**/tests/**/*.spec.js'
  ],
  moduleNameMapper: {
    '^element-ui(.*)$': '<rootDir>$1',
    '^main(.*)$': '<rootDir>/src$1'
  }
}
