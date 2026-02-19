import prettier from 'eslint-config-prettier';

// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs';

export default withNuxt(
  prettier,
  {
    ignores: ['app/styles/vendors/katex/**'],
  },

  {
    plugins: {},

    rules: {
      // 'no-console': ['warn', { allow: ['warn', 'error'] }],
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
);
