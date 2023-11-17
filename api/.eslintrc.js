module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin'],
  extends: ['plugin:@typescript-eslint/recommended'],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    '@typescript-eslint/no-unused-vars': ['error', { args: 'after-used' }],
    '@typescript-eslint/restrict-template-expressions': [
      'error',
      { allowNumber: true, allowNullish: false },
    ],
    '@typescript-eslint/no-floating-promises': [
      'error',
      { ignoreVoid: false, ignoreIIFE: false },
    ],
    '@typescript-eslint/no-misused-promises': 'error',
    '@typescript-eslint/no-unnecessary-condition': 'error',
    '@typescript-eslint/unbound-method': 'error',
    'no-console': 'error',
    'no-debugger': 'error',
  },
};
