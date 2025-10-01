module.exports = {
  env: {
    node: true,
    es2021: true,
    jest: true
  },
  globals: {
    NodeJS: 'readonly',
    Express: 'readonly'
  },
  extends: [
    'eslint:recommended'
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  plugins: ['@typescript-eslint'],
  rules: {
    'no-console': 'off',
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    'prefer-const': 'error'
  },
  ignorePatterns: [
    'node_modules/',
    'coverage/',
    'dist/',
    'build/',
    '*.js'
  ]
};
