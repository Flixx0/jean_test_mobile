import { defineConfig } from 'eslint/config';
import expoConfig from 'eslint-config-expo/flat.js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import reactPlugin from 'eslint-plugin-react';
import unusedImports from 'eslint-plugin-unused-imports';
import globals from 'globals';

export default defineConfig([
  expoConfig,
  eslintPluginPrettierRecommended,
  {
    ignores: ['dist/*'],
  },
  {
    files: ['**/*.{js,mjs,cjs,jsx,mjsx,ts,tsx,mtsx}'],
    ...reactPlugin.configs.flat.recommended,
    plugins: {
      'unused-imports': unusedImports,
    },
    languageOptions: {
      ...reactPlugin.configs.flat.recommended.languageOptions,
      globals: {
        ...globals.serviceworker,
        ...globals.browser,
      },
    },
    rules: {
      'react/react-in-jsx-scope': 'off',
      'no-unused-vars': 'off', // Turn off base rule as it conflicts with unused-imports
      '@typescript-eslint/no-unused-vars': 'off', // Turn off TypeScript rule as it conflicts with unused-imports
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_',
        },
      ],
    },
  },
]);
