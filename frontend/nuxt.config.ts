export default defineNuxtConfig({
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "@/styles/_variables.scss" as *;',
        },
      },
    },
  },
  plugins: ['~/plugins/route', '~/plugins/auth', '~/plugins/pwa'],
  css: ['~/styles/main.scss'],
  modules: [
    // ...
    ['@pinia/nuxt'],
  ],
  app: {
    head: {
      title: 'Scientia',
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
      meta: [
        { name: 'robots', content: 'follow, index' },
        { name: 'theme-color', content: '#001e26' },
        {
          name: 'description',
          content: 'Site web qui regroupe mes notes/cours dans les domaines scientifiques.',
        },

        // Open Graph / Facebook
        { property: 'og:type', content: 'website' },
        { property: 'og:title', content: 'Scientia' },
        {
          property: 'og:description',
          content: 'Site web qui regroupe mes notes/cours dans les domaines scientifiques.',
        },
        { property: 'og:url', content: `https://docs.smaug-6739.dev` },
        { property: 'og:keywords', content: 'Cours, notes' },

        // Twitter
        { name: 'twitter:title', content: `Scientia` },
        { name: 'twitter:creator', content: `@Smaug6739` },
        { name: 'twitter:site', content: `@Smaug6739` },
        { name: 'twitter:url', content: `https://docs.smaug-6739.dev` },
        {
          name: 'twitter:description',
          content: `Site web qui regroupe mes notes/cours dans les domaines scientifiques.`,
        },
      ],
    },
  },
});
