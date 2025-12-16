// @ts-check
import withNuxt, { defineFlatConfigs } from './.nuxt/eslint.config.mjs';
import prettier from 'eslint-config-prettier';

export default withNuxt(
  defineFlatConfigs(
    {
      ignores: ['app/styles/katex/**'],
    },
    {
      rules: {
        'vue/multi-word-component-names': 'off',
        'vue/no-unused-properties': 'error',
      },
    },
    prettier,
  ),
);
