import js from '@eslint/js'
import ts from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'
import vue from 'eslint-plugin-vue'
import unused from 'eslint-plugin-unused-imports'

export default [
  js.configs.recommended,
  {
    files: ['**/*.ts', '**/*.vue'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module'
      }
    },
    plugins: {
      '@typescript-eslint': ts,
      vue,
      'unused-imports': unused
    },
    rules: {
      'no-console': 'warn',
      'no-debugger': 'warn',
      'unused-imports/no-unused-imports': 'error',
      'vue/no-multiple-template-root': 'off',
    }
  }
]
