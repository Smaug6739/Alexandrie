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
  plugins: ['~/plugins/route', '~/plugins/auth'],
  css: ['~/styles/main.scss'],
  modules: [
    // ...
    ['@pinia/nuxt'],
  ],
});
