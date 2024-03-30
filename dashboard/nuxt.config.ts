import { resolve } from 'path';
export default defineNuxtConfig({
  devtools: { enabled: true },
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "../@alexandrie/styles/src/_variables.scss" as *;',
        },
      },
    },
  },
  ssr: false,
  css: [
    resolve(__dirname, '../@alexandrie/styles/src/main.scss'),
    '~/styles/main.scss',
    resolve(__dirname, '../@alexandrie/styles/src/katex/katex.min.css'),
  ],
  modules: ['@pinia/nuxt', '@nuxtjs/color-mode'],
  colorMode: {
    preference: 'light', // default value of $colorMode.preference
    fallback: 'light', // fallback value if not system preference found
    hid: 'nuxt-color-mode-script',
    globalName: '__NUXT_COLOR_MODE__',
    componentName: 'ColorScheme',
    classPrefix: '',
    classSuffix: '-mode',
    storageKey: 'nuxt-color-mode',
  },
  experimental: {
    viewTransition: true,
  },

  app: {
    head: {
      title: 'Alexandrie dashboard',
      viewport: 'width=device-width, initial-scale=1',
      charset: 'utf-8',
      htmlAttrs: {
        lang: 'fr',
      },
      link: [
        {
          rel: 'manifest',
          crossorigin: 'use-credentials',
          href: '/manifest.json',
        },
      ],
    },
  },
});
