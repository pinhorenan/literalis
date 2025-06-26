import { FlatCompat } from '@eslint/eslintrc';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

export default [
  ...compat.extends(
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:jsx-a11y/recommended',
    'plugin:prettier/recommended',
    'next/core-web-vitals',
    'next/typescript',
  ),
  {
    languageOptions: {
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    ignores: ['**/node_modules/**', '**/dist/**', '**/build/**', '**/.next/**'],
    rules: {
      'prettier/prettier': 'error',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'import/order': [
        'warn',
        {
          groups: [['builtin', 'external'], 'internal', ['parent', 'sibling', 'index']],
          pathGroups: [
            {
              pattern: '@/**',
              group: 'internal',
            },
          ],
          pathGroupsExcludedImportTypes: ['builtin'],
          'newlines-between': 'always',
        },
      ],
      'no-restricted-imports': [
        'warn',
        {
          paths: [
            {
              name: '@/libs/server-only',
              message: 'Não importa lógica de servidor em componente client!',
            },
          ],
        },
      ],
      'no-console': warn,
      'react/jsx-curly-brace-presence': ['warn', { props: 'never', children: 'never' }],
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
];
