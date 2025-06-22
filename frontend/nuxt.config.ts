export default defineNuxtConfig({
  devtools: { enabled: process.env.NODE_ENV !== 'production' },
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
    vue: {
      template: {
        compilerOptions: {
          isCustomElement: tag => {
            return ['tag'].includes(tag);
          },
        },
      },
    },
  },
  nitro: {
    compressPublicAssets: true,
    minify: true,
  },
  $production: {
    ignore: [
      '**/*.stories.{js,cts,mts,ts,jsx,tsx}',
      '**/*.{spec,test}.{js,cts,mts,ts,jsx,tsx}',
      '**/*.d.{cts,mts,ts}',
      '**/.{pnpm-store,vercel,netlify,output,git,cache,data}',
      '.nuxt/analyze',
      '.nuxt',
      '**/-*.*', //
      'pages/**/_*',
    ],
  },
  ssr: false,
  css: ['~/styles/main.scss', '~/styles/katex/katex.min.css'],
  modules: ['@pinia/nuxt', '@nuxtjs/color-mode', '@vite-pwa/nuxt'],

  colorMode: {
    preference: 'light', // default value of $colorMode.preference
    fallback: 'light', // fallback value if not system preference found
  },

  pwa: {
    registerType: 'autoUpdate',
    manifest: {
      name: 'Mon App',
      short_name: 'App',
      start_url: '/',
      display: 'standalone',
      background_color: '#ffffff',
      theme_color: '#3f51b5',
      icons: [
        {
          src: '/android-chrome-192x192.png',
          sizes: '192x192',
          type: 'image/png',
        },
      ],
    },
    base: '/',
    workbox: {
      globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
      runtimeCaching: [
        // Pages HTML (navigation)
        {
          urlPattern: ({ request }) => request.mode === 'navigate',
          handler: 'NetworkFirst',
          options: {
            cacheName: 'html-cache',
            networkTimeoutSeconds: 3,
            expiration: {
              maxEntries: 10,
              maxAgeSeconds: 24 * 60 * 60, // 1 jour
            },
          },
        },
        // Appels API
        {
          urlPattern: /^http:\/\/localhost:8201\/api\/.*/,
          handler: 'NetworkFirst',
          options: {
            cacheName: 'api-cache',
            expiration: {
              maxEntries: 50,
              maxAgeSeconds: 86400,
            },
          },
        },
        // Images
        {
          urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/i,
          handler: 'CacheFirst',
          options: {
            cacheName: 'image-cache',
            expiration: {
              maxEntries: 100,
              maxAgeSeconds: 7 * 24 * 60 * 60, // 7 jours
            },
          },
        },
      ],
    },
  },

  experimental: {
    viewTransition: true,
    payloadExtraction: true,
    defaults: {
      nuxtLink: {
        // prefetch: false,
      },
    },
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
        { name: 'mobile-web-app-capable" content', content: 'yes' },
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
        {
          rel: 'preconnect',
          href: 'https://api.alexandrie-hub.fr',
        },
        {
          rel: 'preconnect',
          href: 'https://cdn.alexandrie-hub.fr',
        },
      ],
    },
  },

  compatibilityDate: '2024-07-19',
});
