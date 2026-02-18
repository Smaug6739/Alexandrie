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
      cdnEndpoint: '/alexandrie/',
      // Feature flags
      configDisableSignupPage: '',
      configDisableLandingPage: '',
      configDisableNativeLogin: false,
    },
  },
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
  nitro: {
    compressPublicAssets: true,
    minify: true,
  },

  ssr: false,
  css: ['~/styles/main.scss', '~/styles/vendors/katex/katex.min.css'],
  modules: ['@pinia/nuxt', '@nuxtjs/color-mode', '@vite-pwa/nuxt', '@nuxt/eslint', '@nuxtjs/i18n'],

  colorMode: {
    preference: 'light', // default value of $colorMode.preference
    fallback: 'light', // fallback value if not system preference found
    classSuffix: '-mode',
  },

  i18n: {
    strategy: 'no_prefix',
    locales: [
      { code: 'en', language: 'en-US' },
      { code: 'fr', language: 'fr-FR' },
    ],
    defaultLocale: 'en',
    experimental: {
      typedOptionsAndMessages: 'default',
    },
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
      share_target: {
        action: '/dashboard/share-target',
        method: 'POST',
        enctype: 'multipart/form-data',
        params: {
          title: 'title',
          text: 'text',
          url: 'url',
          files: [
            {
              name: 'files',
              accept: ['image/*', 'application/pdf', 'text/*', 'application/json', '.md', '.txt', '.json', '.csv'],
            },
          ],
        },
      },
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
    strategies: 'injectManifest',
    srcDir: '.',
    filename: 'sw.ts',
    base: '/',
    injectManifest: {
      maximumFileSizeToCacheInBytes: 30_000_000,
      globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
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
            'Alexandrie is a modern note-taking and knowledge base application built for developers and power users. Write, organize and render beautiful notes using extended Markdown in a fast, clean and distraction-free interface. Self-hostable with Docker.',
        },
        {
          name: 'keywords',
          content:
            'markdown notes, note taking app, knowledge base, developer notes, markdown editor, personal wiki, technical documentation, pwa notes, docker, self-hosted',
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
        { property: 'og:type', content: 'website' },
        { property: 'og:site_name', content: 'Alexandrie' },
        { property: 'og:title', content: 'Alexandrie – Modern Markdown Note-Taking & Knowledge Base App' },
        {
          property: 'og:description',
          content: 'A modern note-taking and knowledge base app for developers, built around extended Markdown and self-hostable with Docker.',
        },
        { property: 'og:url', content: 'https://alexandrie-hub.fr' },
        { property: 'og:image', content: '/icons/icon-192.png' },

        // Twitter Card
        { name: 'twitter:title', content: 'Alexandrie – Modern Markdown Note-Taking App' },
        {
          name: 'twitter:description',
          content: 'Write and organize beautiful notes with extended Markdown. Fast, clean and developer-friendly. Self-hostable with Docker.',
        },
        { name: 'twitter:card', content: 'summary' },
        { name: 'twitter:image', content: '/icons/icon-192.png' },
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
        { rel: 'preconnect', href: 'https://api.alexandrie-hub.fr' },
        { rel: 'preconnect', href: 'https://cdn.alexandrie-hub.fr' },
      ],
    },
  },

  compatibilityDate: '2024-07-19',
});
