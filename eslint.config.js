import js from '@eslint/js'
import globals from 'globals'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'

export default [
  { ignores: ['dist'] },
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    settings: { react: { version: '22' } },
    plugins: {
      react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...react.configs.recommended.rules,
      ...react.configs['jsx-runtime'].rules,
      ...reactHooks.configs.recommended.rules,
      'react/jsx-no-target-blank': 'off',
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      'no-unused-vars': [
        'warn',
        { // Or 'off' to completely disable
          vars: 'all', // Check all variables
          args: 'after-used', // Check arguments after they are used
          ignoreRestSiblings: true, // Ignore ...rest siblings
          caughtErrors: 'none', // Do not check for unused caught errors
          // The following is the crucial part for your question:
          varsIgnorePattern: 'React', // Ignore variables matching this regex (case-sensitive)
        }
      ],
    },
    ignores: [
      'node_modules',
      'dist'
    ],
  },
]
