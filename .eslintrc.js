
module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir : __dirname,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin'],
  extends: [
    'plugin:@typescript-eslint/recommended',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    "quotes": [2, "single", "avoid-escape"],
    "indent": ["error", 4, { "SwitchCase": 1, "ignoredNodes": ["PropertyDefinition"] }],
    "no-multiple-empty-lines": ["error", { "max": 1, "maxEOF": 0 }],
    "@typescript-eslint/object-curly-spacing": ["error", 'always'],
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
  },
};







// module.exports = {
//   env: {
//     browser: true,
//     es2021: true
//   },
//   extends: 'standard-with-typescript',
//   overrides: [
//   ],
//   parserOptions: {
//     ecmaVersion: 'latest',
//     sourceType: 'module'
//   },
//   rules: {
//   }
// }
