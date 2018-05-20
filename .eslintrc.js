module.exports = {
  root: true,
  parserOptions: {
    parser: 'babel-eslint',
    sourceType: 'module'
  },
  env: {
    node: true,
    jest: true
  },
  extends: [
    'standard',
    'plugin:jest/recommended'
  ],
  plugins: [
    'html',
    'jest'
  ],
  rules: {
    'space-before-function-paren': 'off',
    'no-console': 'warn'
  },
  globals: {}
}