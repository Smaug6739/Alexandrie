import { resolve } from 'path';
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons';
import { defineNuxtConfig } from 'nuxt/config';

export default defineNuxtConfig({
  devtools: { enabled: process.env.NODE_ENV !== 'production' },
  runtimeConfig: {
    public: {
      // Base URLs
      baseApi: '',
      baseCdn: '',
      // Feature flags
      configDisableSignupPage: '',
      configDisableLandingPage: '',
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
    classSuffix: '-mode',
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
          src: '/icons/icon-m-144.png',
          sizes: '144x144',
          type: 'image/png',
          purpose: 'maskable',
        },
        {
          src: '/icons/icon-m-192.png',
          sizes: '192x192',
          type: 'image/png',
          purpose: 'maskable',
        },
        {
          src: '/icons/icon-m-512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'maskable',
        },
        {
          src: '/icons/icon-144.png',
          sizes: '144x144',
          type: 'image/png',
          purpose: 'any',
        },
        {
          src: '/icons/icon-192.png',
          sizes: '192x192',
          type: 'image/png',
          purpose: 'any',
        },
        {
          src: '/icons/icon-512.png',
          sizes: '512x512',
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
          // Api cache: match /api calls
          urlPattern: ({ url }) => url.pathname.startsWith('/api/'),
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
        // SEO
        {
          name: 'description',
          content:
            'Alexandrie is a modern note-taking and knowledge base application built for developers and power users. Write, organize and render beautiful notes using extended Markdown in a fast, clean and distraction-free interface.',
        },
        {
          name: 'keywords',
          content: 'markdown notes, note taking app, knowledge base, developer notes, markdown editor, personal wiki, technical documentation, pwa notes',
        },
        { name: 'author', content: 'Alexandrie Team' },
        { name: 'robots', content: 'index, follow' },
        { name: 'referrer', content: 'strict-origin-when-cross-origin' },

        // PWA / Mobile
        { name: 'application-name', content: 'Alexandrie' },
        { name: 'apple-mobile-web-app-title', content: 'Alexandrie' },
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'mobile-web-app-capable', content: 'yes' },
        { name: 'theme-color', content: '#3956e7' },

        // Open Graph
        { name: 'og:type', content: 'website' },
        { name: 'og:site_name', content: 'Alexandrie' },
        { name: 'og:title', content: 'Alexandrie – Modern Markdown Note-Taking & Knowledge Base App' },
        { name: 'og:description', content: 'A modern note-taking and knowledge base app for developers, built around extended Markdown.' },
        { name: 'og:url', content: 'https://alexandrie-hub.fr' },
        { name: 'og:image', content: '/android-chrome-192x192.png' },

        // Twitter Card
        { name: 'twitter:title', content: 'Alexandrie – Modern Markdown Note-Taking App' },
        { name: 'twitter:description', content: 'Write and organize beautiful notes with extended Markdown. Fast, clean and developer-friendly.' },
        { name: 'twitter:card', content: 'summary' },
        { name: 'twitter:image', content: '/android-chrome-192x192.png' },
        { name: 'twitter:image:alt', content: 'Alexandrie' },
      ],
      link: [
        {
          rel: 'canonical',
          href: 'https://alexandrie-hub.fr',
        },
        {
          rel: 'manifest',
          href: '/manifest.webmanifest',
        },
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
        { rel: 'preconnect', href: 'https://fonts.gstatic.com' },
        { rel: 'preconnect', href: 'https://api.alexandrie-hub.fr' },
        { rel: 'preconnect', href: 'https://cdn.alexandrie-hub.fr' },
      ],
    },
  },

  compatibilityDate: '2024-07-19',
});
