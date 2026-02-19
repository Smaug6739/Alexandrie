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
      plugins: {
        perfectionist,
      },

      rules: {
        'no-console': ['warn', { allow: ['warn', 'error'] }],
        'no-duplicate-imports': 'error',
        'no-var': 'error',
        'perfectionist/sort-imports': [
          'error',
          {
            newlinesBetween: 1,
            order: 'asc',
            type: 'alphabetical',
          },
        ],

        'perfectionist/sort-interfaces': [
          'error',
          {
            order: 'asc',
            type: 'alphabetical',
          },
        ],

        /*'perfectionist/sort-objects': [
          'error',
          {
            ignoreCase: false,
            order: 'asc',
            type: 'alphabetical',
          },
        ],*/

        'perfectionist/sort-union-types': [
          'error',
          {
            order: 'asc',
            type: 'alphabetical',
          },
        ],

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
);
