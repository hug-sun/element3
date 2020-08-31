module.exports = {
  root: true,
  env: {
    browser: true,
    es2020: true,
    node: true,
    jest: true
  },
  globals: {
    ga: true,
    chrome: true
  },
  extends: [
    'plugin:vue/essential',
    'standard',
    'prettier',
    'plugin:json/recommended'
  ],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true
    }
  },
  plugins: ['vue', 'prettier'],
  rules: {
    'prettier/prettier': ['error'],
    'no-case-declarations': ['off'],
    'vue/no-use-v-if-with-v-for': ['off']
  }
}
