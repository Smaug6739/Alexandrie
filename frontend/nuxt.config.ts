export default defineNuxtConfig({
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "@/common/styles/_variables.scss" as *;',
        },
      },
    },
  },
  routeRules: {
    // Enable Incremental Static Generation (ISG)
    //'/**': { swr: 300 },
  },

  css: ['~/styles/main.scss'],
  modules: [
    // ...
    '@pinia/nuxt',
  ],
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
      meta: [
        { name: 'robots', content: 'follow, index' },
        { name: 'theme-color', content: '#312b41' },
        {
          name: 'description',
          content: 'Site web qui regroupe des notes/cours dans les domaines scientifiques.',
        },

        // Open Graph / Facebook
        { property: 'og:type', content: 'website' },
        { property: 'og:title', content: 'Alexandrie' },
        {
          property: 'og:description',
          content: 'Site web qui regroupe des notes/cours dans les domaines scientifiques.',
        },
        { property: 'og:url', content: `https://alexandrie-hub.fr` },
        { property: 'og:keywords', content: 'Cours, notes' },

        // Twitter
        { name: 'twitter:title', content: `Alexandrie` },
        { name: 'twitter:creator', content: `@Smaug6739` },
        { name: 'twitter:site', content: `Alexandrie` },
        { name: 'twitter:url', content: `https://alexandrie-hub.fr` },
        {
          name: 'twitter:description',
          content: `Site web qui regroupe des notes/cours dans les domaines scientifiques.`,
        },
      ],
    },
  },
});
