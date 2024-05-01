module.exports = {
  root: true,
    parser: '@typescript-eslint/parser',
    extends: [
      'eslint:recommended',
      'plugin:@typescript-eslint/recommended',
      'plugin:@typescript-eslint/strict',
      'plugin:prettier/recommended',
    ],
    plugins: ['@typescript-eslint', 'no-only-tests'],
    parserOptions: {    
      tsconfigRootDir: __dirname,
      project: ['./tsconfig.eslint.json'],
    },
    env: {
      node: true,
      jest: true,
      commonjs: true,
      es2022: true,
    },
    rules: {
      'no-restricted-syntax': ['error', 'LabeledStatement', 'WithStatement'],
      'no-only-tests/no-only-tests': [
        'error',
        {
          focus: ['only', 'skip'],
        },
      ],
      'no-prototype-builtins': 'off',
      '@typescript-eslint/no-explicit-any': 'off'
    },
  };
  