import { defineNuxtConfig } from 'nuxt/config';
import { resolve } from 'path';
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons';

export default defineNuxtConfig({
  app: {
    head: {
      charset: 'utf-8',
      htmlAttrs: {
        lang: 'en',
      },
      link: [
        {
          href: 'https://alexandrie-hub.fr',
          rel: 'canonical',
        },
        {
          href: '/manifest.webmanifest',
          rel: 'manifest',
        },
        {
          href: '/favicon-dark.ico',
          media: '(prefers-color-scheme: dark)',
          rel: 'icon',
          type: 'image/x-icon',
        },
        {
          href: '/favicon.ico',
          media: '(prefers-color-scheme: light), (prefers-color-scheme: no-preference)',
          rel: 'icon',
          type: 'image/x-icon',
        },
        { href: 'https://api.alexandrie-hub.fr', rel: 'preconnect' },
        { href: 'https://cdn.alexandrie-hub.fr', rel: 'preconnect' },
      ],
      meta: [
        // SEO
        {
          content:
            'Alexandrie is a modern note-taking and knowledge base application built for developers and power users. Write, organize and render beautiful notes using extended Markdown in a fast, clean and distraction-free interface. Self-hostable with Docker.',
          name: 'description',
        },
        {
          content:
            'markdown notes, note taking app, knowledge base, developer notes, markdown editor, personal wiki, technical documentation, pwa notes, docker, self-hosted',
          name: 'keywords',
        },
        { content: 'Alexandrie Team', name: 'author' },
        { content: 'index, follow', name: 'robots' },
        { content: 'strict-origin-when-cross-origin', name: 'referrer' },

        // PWA / Mobile
        { content: 'Alexandrie', name: 'application-name' },
        { content: 'Alexandrie', name: 'apple-mobile-web-app-title' },
        { content: 'yes', name: 'apple-mobile-web-app-capable' },
        { content: 'yes', name: 'mobile-web-app-capable' },
        { content: '#3956e7', name: 'theme-color' },

        // Open Graph
        { content: 'website', property: 'og:type' },
        { content: 'Alexandrie', property: 'og:site_name' },
        { content: 'Alexandrie – Modern Markdown Note-Taking & Knowledge Base App', property: 'og:title' },
        {
          content: 'A modern note-taking and knowledge base app for developers, built around extended Markdown and self-hostable with Docker.',
          property: 'og:description',
        },
        { content: 'https://alexandrie-hub.fr', property: 'og:url' },
        { content: '/icons/icon-192.png', property: 'og:image' },

        // Twitter Card
        { content: 'Alexandrie – Modern Markdown Note-Taking App', name: 'twitter:title' },
        {
          content: 'Write and organize beautiful notes with extended Markdown. Fast, clean and developer-friendly. Self-hostable with Docker.',
          name: 'twitter:description',
        },
        { content: 'summary', name: 'twitter:card' },
        { content: '/icons/icon-192.png', name: 'twitter:image' },
        { content: 'Alexandrie', name: 'twitter:image:alt' },
      ],
      title: 'Alexandrie',
      viewport: 'width=device-width, initial-scale=1',
    },
  },
  colorMode: {
    classSuffix: '-mode',
    fallback: 'light', // fallback value if not system preference found
    preference: 'light', // default value of $colorMode.preference
  },
  compatibilityDate: '2024-07-19',
  css: ['~/styles/main.scss', '~/styles/vendors/katex/katex.min.css'],

  devtools: { enabled: process.env.NODE_ENV !== 'production' },
  experimental: {
    defaults: {
      nuxtLink: {
        // prefetch: false,
      },
    },
    payloadExtraction: true,
    viewTransition: true,
  },
  i18n: {
    defaultLocale: 'en',
    experimental: {
      preload: false,
      stripMessagesPayload: true,
      typedOptionsAndMessages: 'default',
    },
    locales: [
      { code: 'en', file: 'en/index.ts', language: 'en-US' },
      { code: 'fr', file: 'fr/index.ts', language: 'fr-FR' },
    ],
    strategy: 'no_prefix',
  },

  modules: ['@pinia/nuxt', '@nuxtjs/color-mode', '@vite-pwa/nuxt', '@nuxt/eslint', '@nuxtjs/i18n'],

  nitro: {
    compressPublicAssets: true,
    minify: true,
  },

  pwa: {
    base: '/',
    filename: 'sw.ts',
    injectManifest: {
      globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
      maximumFileSizeToCacheInBytes: 30_000_000,
    },
    manifest: {
      background_color: '#334155',
      description: 'App for taking beautiful notes in extended Markdown format.',
      display: 'standalone',
      icons: [
        {
          purpose: 'maskable',
          sizes: '144x144',
          src: '/icons/icon-m-144.png',
          type: 'image/png',
        },
        {
          purpose: 'maskable',
          sizes: '192x192',
          src: '/icons/icon-m-192.png',
          type: 'image/png',
        },
        {
          purpose: 'maskable',
          sizes: '512x512',
          src: '/icons/icon-m-512.png',
          type: 'image/png',
        },
        {
          purpose: 'any',
          sizes: '144x144',
          src: '/icons/icon-144.png',
          type: 'image/png',
        },
        {
          purpose: 'any',
          sizes: '192x192',
          src: '/icons/icon-192.png',
          type: 'image/png',
        },
        {
          purpose: 'any',
          sizes: '512x512',
          src: '/icons/icon-512.png',
          type: 'image/png',
        },
      ],
      name: 'Alexandrie',
      screenshots: [
        {
          form_factor: 'wide',
          label: 'Note rendering',
          sizes: '1920x1080',
          src: '/screenshots/mock/1.png',
          type: 'image/png',
        },
        {
          form_factor: 'wide',
          label: 'Note editor',
          sizes: '1920x1080',
          src: '/screenshots/mock/2.png',
          type: 'image/png',
        },
        {
          form_factor: 'wide',
          label: 'Note list',
          sizes: '1920x1080',
          src: '/screenshots/mock/3.png',
          type: 'image/png',
        },
        {
          form_factor: 'narrow',
          label: 'Demo phone',
          sizes: '1920x1920',
          src: '/screenshots/mock/phone-1.png',
          type: 'image/png',
        },
      ],
      share_target: {
        action: '/dashboard/share-target',
        enctype: 'multipart/form-data',
        method: 'POST',
        params: {
          files: [
            {
              accept: ['image/*', 'application/pdf', 'text/*', 'application/json', '.md', '.txt', '.json', '.csv'],
              name: 'files',
            },
          ],
          text: 'text',
          title: 'title',
          url: 'url',
        },
      },
      short_name: 'Alexandrie',
      start_url: '/dashboard',
      theme_color: '#3956e7',
    },
    registerType: 'autoUpdate',
    srcDir: '.',
    strategies: 'injectManifest',
  },

  runtimeConfig: {
    public: {
      // Base URLs
      baseApi: '',
      baseCdn: '',
      cdnEndpoint: '/alexandrie/',
      configDisableLandingPage: '',
      configDisableNativeLogin: false,
      // Feature flags
      configDisableSignupPage: '',
    },
  },

  ssr: false,

  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: "@use '~/styles/abstract/static.scss' as *;",
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
});
