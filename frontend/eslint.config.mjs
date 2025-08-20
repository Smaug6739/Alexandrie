// @ts-check
import withNuxt, { defineFlatConfigs } from './.nuxt/eslint.config.mjs';

export default withNuxt(
  // ignore app/styles/katex
  defineFlatConfigs({
    ignores: ['app/styles/katex/**'],
  }),
);
