export default defineNuxtPlugin(nuxtApp => {
  nuxtApp.hook('app:suspense:resolve', () => {
    console.log('[Plugin] App suspense resolved, removing splash screen...');
    const splash = document.getElementById('__nuxt-loader');
    if (!splash) return;

    splash.classList.add('fade-out');

    splash.addEventListener(
      'transitionend',
      () => {
        splash.remove();
      },
      { once: true },
    );
  });
});
