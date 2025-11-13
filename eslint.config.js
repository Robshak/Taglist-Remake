import js from '@eslint/js'
import { defineConfig, globalIgnores } from 'eslint/config'
import prettierConfig from 'eslint-config-prettier'
import importPlugin from 'eslint-plugin-import'
import prettier from 'eslint-plugin-prettier'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import unusedImports from 'eslint-plugin-unused-imports'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default defineConfig([
  globalIgnores(['dist', 'build', 'coverage', 'node_modules']),
  {
    ignores: [
      'eslint.config.mjs',
      '**/*.config.{js,cjs,mjs}',
      'stylelint.config.cjs',
      'vite/**'
    ],
  },

  js.configs.recommended,

  {
    files: ['**/*.{js,jsx}'],
    ignores: ['vite/**'],
    languageOptions: {
      ecmaVersion: 2023,
      sourceType: 'module',
      globals: { ...globals.browser, ...globals.node },
    },
    plugins: {
      import: importPlugin,
      prettier,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      'unused-imports': unusedImports,
    },
    rules: {
      ...reactHooks.configs['recommended-latest'].rules,
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],

      'prettier/prettier': 'error',
      'unused-imports/no-unused-imports': 'error',
      'import/order': ['warn', {
        'newlines-between': 'always',
        alphabetize: { order: 'asc', caseInsensitive: true },
        groups: [['builtin', 'external'], ['internal'], ['parent', 'sibling', 'index']],
        pathGroups: [{ pattern: '@/**', group: 'internal', position: 'before' }],
        pathGroupsExcludedImportTypes: ['builtin'],
      }],
      'import/no-duplicates': ['error', { 'prefer-inline': true }],

      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-debugger': 'warn',
      'eol-last': ['error', 'always'],
      'no-multiple-empty-lines': ['error', { max: 1, maxEOF: 1, maxBOF: 0 }],
      'react-hooks/exhaustive-deps': 'warn',
    },
  },

  ...tseslint.configs.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
      ecmaVersion: 2023,
      sourceType: 'module',
      globals: globals.browser,
    },
    plugins: {
      import: importPlugin,
      prettier,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      'unused-imports': unusedImports,
      '@typescript-eslint': tseslint.plugin,
    },
    rules: {
      ...tseslint.configs.recommendedTypeChecked[0].rules,

      ...reactHooks.configs['recommended-latest'].rules,
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      'react-hooks/exhaustive-deps': 'warn',

      'prettier/prettier': 'error',
      'unused-imports/no-unused-imports': 'error',
      'import/order': ['warn', {
        'newlines-between': 'always',
        alphabetize: { order: 'asc', caseInsensitive: true },
        groups: [['builtin', 'external'], ['internal'], ['parent', 'sibling', 'index']],
        pathGroups: [{ pattern: '@/**', group: 'internal', position: 'before' }],
        pathGroupsExcludedImportTypes: ['builtin'],
      }],
      'import/no-duplicates': ['error', { 'prefer-inline': true }],

      '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports' }],
      '@typescript-eslint/consistent-type-exports': 'error',

      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-debugger': 'warn',
      'eol-last': ['error', 'always'],
      'no-multiple-empty-lines': ['error', { max: 1, maxEOF: 1, maxBOF: 0 }],
    },
  },

  {
    files: ['**/*.cjs'],
    languageOptions: {
      sourceType: 'commonjs',
      globals: globals.node,
    },
  },

  prettierConfig,
])