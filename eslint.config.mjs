import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({ baseDirectory: __dirname });

const eslintConfig = [
  ...compat.extends(
    'next',
    'next/core-web-vitals',
    'next/typescript',
    'plugin:prettier/recommended',
    // Temporarily removing tailwindcss plugin due to version conflict with Tailwind v4
    // "plugin:tailwindcss/recommended",
  ),
  {
    rules: {
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
      'react/no-unescaped-entities': 'warn',
      'react-hooks/rules-of-hooks': 'error',
      '@typescript-eslint/no-non-null-asserted-optional-chain': 'warn',
    },
  },
];

export default eslintConfig;
