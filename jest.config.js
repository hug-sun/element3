module.exports = {
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.vue$': 'vue-jest',
    '^.+\\js$': 'babel-jest'
  },
  moduleFileExtensions: ['vue', 'js', 'json', 'jsx', 'ts', 'tsx', 'node'],
  testMatch: ['**/tests/?(*.)+(test).[jt]s?(x)'],
  moduleNameMapper: {
    '^element-ui(.*)$': '<rootDir>$1',
    '^main(.*)$': '<rootDir>/src$1'
  }
}
