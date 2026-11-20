import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'
import { APPART_BOUNDARY_FILES, eslintRestrictedPaths } from './scripts/lib/appart-boundary.mjs'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
  },
  // (L'Appart, 13/11/2026) Frontière des deux gammes : les fichiers de L'Appart n'importent aucune preuve ni table des maisons
  // (règles et raisons : scripts/lib/appart-boundary.mjs ; même contrôle, sans ESLint : tools/test/appart-boundary.test.mjs).
  {
    files: APPART_BOUNDARY_FILES,
    rules: {
      'no-restricted-imports': ['error', { paths: eslintRestrictedPaths() }],
    },
  },
])
