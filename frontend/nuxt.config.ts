export default defineNuxtConfig({
  devtools: { enabled: true },

  future: {
    compatibilityVersion: 4,
  },

  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: "@use '~/styles/_variables.scss' as *;",
          api: 'modern',
        },
      },
    },
  },

  ssr: false,
  css: ['~/styles/main.scss', '~/styles/katex/katex.min.css'],
  modules: ['@pinia/nuxt', '@nuxtjs/color-mode'],

  colorMode: {
    preference: 'light', // default value of $colorMode.preference
    fallback: 'light', // fallback value if not system preference found
  },

  experimental: {
    viewTransition: true,
  },

  app: {
    head: {
      title: 'Alexandrie',
      viewport: 'width=device-width, initial-scale=1',
      charset: 'utf-8',
      htmlAttrs: {
        lang: 'fr',
      },
      meta: [
        { name: 'author', content: 'Smaug6739' },
        { name: 'description', content: 'A website for taking beautiful notes in extended Markdown format.' },
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-title', content: 'Alexandrie' },
        { name: 'application-name', content: 'Alexandrie' },
        { name: 'theme-color', content: '#007aff' },
        { name: 'twitter:card', content: 'summary' },
        { name: 'twitter:title', content: 'Alexandrie' },
        { name: 'twitter:description', content: 'A website for taking beautiful notes in extended Markdown format.' },
        { name: 'twitter:image', content: '/android-chrome-192x192.png' },
        { name: 'twitter:image:alt', content: 'Alexandrie' },
        { name: 'og:type', content: 'website' },
        { name: 'og:site_name', content: 'Alexandrie' },
        { name: 'og:title', content: 'Alexandrie' },
        { name: 'og:description', content: 'A website for taking beautiful notes in extended Markdown format.' },
        { name: 'og:image', content: '/android-chrome-192x192.png' },
        { name: 'og:image:alt', content: 'Alexandrie' },
        { name: 'og:url', content: 'https://alexandrie-hub.fr' },
      ],
      link: [
        {
          rel: 'manifest',
          crossorigin: 'use-credentials',
          href: '/manifest.json',
        },
        {
          rel: 'icon',
          type: 'image/x-icon',
          href: '/favicon.ico',
        },
        {
          rel: 'preconnect',
          href: 'https://fonts.gstatic.com',
        },
      ],
    },
  },

  compatibilityDate: '2024-07-19',
});
