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
  css: [resolve(__dirname, '../@alexandrie/styles/src/main.scss'), '~/styles/main.scss'],
  modules: ['@pinia/nuxt'],
  app: {
    head: {
      title: 'Alexandrie',
      viewport: 'width=device-width, initial-scale=1',
      charset: 'utf-8',
      htmlAttrs: {
        lang: 'en',
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
  experimental: {
    viewTransition: true,
  },
});
