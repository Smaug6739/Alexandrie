import { resolve } from 'path';
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons';
import { defineNuxtConfig } from 'nuxt/config';

export default defineNuxtConfig({
  devtools: { enabled: process.env.NODE_ENV !== 'production' },
  runtimeConfig: {
    public: {
      baseApi: '',
      baseCdn: '',
    },
  },
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: "@use '~/styles/_variables.scss' as *;",
        },
      },
    },
    plugins: [
      createSvgIconsPlugin({
        iconDirs: [resolve(process.cwd(), 'public/app-icons/')],
        symbolId: 'icon-[name]',
      }),
    ],
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
  modules: ['@pinia/nuxt', '@nuxtjs/color-mode', '@vite-pwa/nuxt', '@nuxt/eslint'],

  colorMode: {
    preference: 'light', // default value of $colorMode.preference
    fallback: 'light', // fallback value if not system preference found
  },

  pwa: {
    registerType: 'autoUpdate',
    manifest: {
      name: 'Alexandrie',
      short_name: 'Alexandrie',
      description: 'App for taking beautiful notes in extended Markdown format.',
      start_url: '/dashboard',
      display: 'standalone',
      background_color: '#334155',
      theme_color: '#3956e7',
      icons: [
        {
          src: '/icons/maskable_icon_x48.png',
          sizes: '48x48',
          type: 'image/png',
          purpose: 'maskable',
        },
        {
          src: '/icons/maskable_icon_x72.png',
          sizes: '72x72',
          type: 'image/png',
          purpose: 'maskable',
        },
        {
          src: '/icons/maskable_icon_x96.png',
          sizes: '96x96',
          type: 'image/png',
          purpose: 'maskable',
        },
        {
          src: '/icons/maskable_icon_x144.png',
          sizes: '144x144',
          type: 'image/png',
          purpose: 'maskable',
        },
        {
          src: '/android-chrome-192x192.png',
          sizes: '192x192',
          type: 'image/png',
          purpose: 'any',
        },
      ],
      screenshots: [
        {
          src: '/screenshots/mock/1.png',
          sizes: '1920x1080',
          type: 'image/png',
          label: 'Note rendering',
          form_factor: 'wide',
        },
        {
          src: '/screenshots/mock/2.png',
          sizes: '1920x1080',
          type: 'image/png',
          label: 'Note editor',
          form_factor: 'wide',
        },
        {
          src: '/screenshots/mock/3.png',
          sizes: '1920x1080',
          type: 'image/png',
          label: 'Note list',
          form_factor: 'wide',
        },
        {
          src: '/screenshots/mock/phone-1.png',
          sizes: '1920x1920',
          type: 'image/png',
          label: 'Demo phone',
          form_factor: 'narrow',
        },
      ],
    },
    base: '/',
    workbox: {
      maximumFileSizeToCacheInBytes: 3000000,
      navigateFallback: null,
      globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
      runtimeCaching: [
        // Pages HTML (navigation)
        {
          urlPattern: ({ request }) => request.mode === 'navigate',
          handler: 'NetworkFirst',
          options: {
            networkTimeoutSeconds: 3,
          },
        },
        {
          urlPattern: /^http[s]?:\/\/[^/]+\/api\/.*/,
          handler: 'NetworkFirst',
          options: {
            cacheName: 'api-cache',
            expiration: {
              maxEntries: 50,
              maxAgeSeconds: 86400,
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
        lang: 'en',
      },
      meta: [
        { name: 'author', content: 'Smaug6739' },
        { name: 'description', content: 'A website for taking beautiful notes in extended Markdown format.' },
        { name: 'mobile-web-app-capable" content', content: 'yes' },
        { name: 'apple-mobile-web-app-title', content: 'Alexandrie' },
        { name: 'application-name', content: 'Alexandrie' },
        { name: 'theme-color', content: '#3956e7' },
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
        /*{
          rel: 'manifest',
          crossorigin: 'use-credentials',
          href: '/manifest.json',
        },*/
        {
          rel: 'manifest',
          href: '/manifest.webmanifest',
        },
        // favicon for dark theme
        {
          rel: 'icon',
          type: 'image/x-icon',
          href: '/favicon-dark.ico',
          media: '(prefers-color-scheme: dark)',
        },
        {
          rel: 'icon',
          type: 'image/x-icon',
          href: '/favicon.ico',
          media: '(prefers-color-scheme: light), (prefers-color-scheme: no-preference)',
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
