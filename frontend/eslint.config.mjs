import prettier from 'eslint-config-prettier';
import perfectionist from 'eslint-plugin-perfectionist';

// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs';

export default withNuxt(
  prettier,

  {
    ignores: ['app/styles/vendors/katex/**'],
  },

  {
    rules: {
      'no-duplicate-imports': 'error',
      'no-var': 'error',
      'prefer-const': 'error',

      'vue/block-lang': [
        'error',
        {
          script: { lang: 'ts' },
        },
      ],
      'vue/component-name-in-template-casing': ['error', 'PascalCase'],
      'vue/multi-word-component-names': 'off',
      'vue/no-unused-properties': 'error',
    },
  },

  {
    files: ['i18n/**/*.ts'],
    plugins: {
      perfectionist,
    },
    rules: {
      'perfectionist/sort-objects': [
        'error',
        {
          type: 'alphabetical',
          order: 'asc',
        },
      ],
    },
  },
);
