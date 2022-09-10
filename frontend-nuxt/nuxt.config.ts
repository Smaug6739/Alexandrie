import { defineNuxtConfig } from 'nuxt';

// https://v3.nuxtjs.org/api/configuration/nuxt.config
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
  plugins: ['~/plugins/route'],
  css: ['~/styles/main.scss'],
  modules: [
    // ...
    ['@pinia/nuxt'],
  ],
});
