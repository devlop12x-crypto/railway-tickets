import js from '@eslint/js';
import { defineConfig } from 'eslint/config';
import prettier from 'eslint-config-prettier';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default defineConfig(
  // Первой записью: без неё линтер после сборки разбирает минифицированный dist
  { ignores: ['dist', 'node_modules', 'coverage'] },

  js.configs.recommended,
  tseslint.configs.recommended,

  {
    files: ['src/**/*.{ts,tsx}'],
    extends: [
      // Требование этапа: recommended-набор eslint-plugin-react
      react.configs.flat.recommended,
      react.configs.flat['jsx-runtime'],
      reactHooks.configs.flat.recommended,
      jsxA11y.flatConfigs.recommended,
    ],
    languageOptions: {
      globals: globals.browser,
    },
    settings: {
      react: { version: 'detect' },
    },
    rules: {
      // Типы пропсов проверяет TypeScript
      'react/prop-types': 'off',
      '@typescript-eslint/consistent-type-imports': 'error',
      // _name — осознанно неиспользуемое: отброшенное поле при деструктуризации, параметр по сигнатуре
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_', ignoreRestSiblings: true },
      ],
      eqeqeq: ['error', 'always'],
      'no-console': ['warn', { allow: ['warn', 'error'] }],
    },
  },

  // Слои: shared → entities → api → features → layout/pages → app. Импорт только «вниз»:
  // переиспользуемое не знает о страницах, а данные макета (mocks) видит только api.
  ...[
    ['src/shared/**', ['entities', 'api', 'features', 'layout', 'pages', 'app', 'mocks']],
    ['src/entities/**', ['api', 'features', 'layout', 'pages', 'app', 'mocks']],
    ['src/api/**', ['features', 'layout', 'pages', 'app']],
    ['src/features/**', ['layout', 'pages', 'app', 'mocks']],
    ['src/layout/**', ['pages', 'app', 'mocks']],
  ].map(([layer, forbidden]) => ({
    files: [`${layer}/*.{ts,tsx}`],
    ignores: ['src/**/*.test.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: forbidden.flatMap((name) => [`**/${name}`, `**/${name}/**`]),
              message: 'Нарушение слоёв: импорт возможен только из нижележащих слоёв.',
            },
          ],
        },
      ],
    },
  })),

  {
    files: ['*.{js,ts}'],
    languageOptions: {
      globals: globals.node,
    },
  },

  // Отключает правила, конфликтующие с Prettier. Должен идти последним.
  prettier,
);
