import js from '@eslint/js'
import globals from 'globals'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'

export default [
  { ignores: ['dist/**', 'node_modules/**', 'src/data/generated/**'] },

  {
    files: ['**/*.{js,jsx,mjs}'],
    ...js.configs.recommended,
    languageOptions: {
      ecmaVersion: 2023,
      sourceType: 'module',
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    plugins: {
      react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    settings: { react: { version: '18.3' } },
    rules: {
      ...js.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,

      // Core no-unused-vars cannot see that <Result /> is a use of the
      // imported Result. Without these two every component import in the
      // project reads as dead.
      'react/jsx-uses-vars': 'error',
      'react/jsx-uses-react': 'error',
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],

      // An unused argument is usually a signature being kept deliberately;
      // an unused local almost never is.
      'no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],

      // Empty catch blocks are load-bearing here — storage.js has to keep
      // playing when localStorage throws in private browsing. A comment
      // inside the block is the signal that it was meant.
      'no-empty': ['error', { allowEmptyCatch: true }],
    },
  },

  {
    files: ['scripts/**/*.mjs', '*.config.js', 'vite.config.js', 'vitest.config.js'],
    languageOptions: { globals: globals.node },
  },

  // Three files export a lookup table beside the components that read
  // it — ICONS, PARTS — and main.jsx is an entry point with no exports
  // at all. Fast refresh would rather each of those were its own file.
  // Splitting a vocabulary away from the parts it names to buy finer
  // hot-reload granularity is a bad trade, so the rule is off here and
  // on everywhere else.
  {
    files: ['src/main.jsx', 'src/art/Mark.jsx', 'src/art/Parts.jsx'],
    rules: { 'react-refresh/only-export-components': 'off' },
  },
]
