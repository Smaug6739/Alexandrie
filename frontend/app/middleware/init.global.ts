export default defineNuxtRouteMiddleware(async (to, _) => {
  if (!to.path.startsWith('/dashboard')) return;

  if (import.meta.client) {
    const preferencesStore = usePreferencesStore();
    const collapseStore = useCollapseStore();

    // console.log('🚦 [Middleware] Blocking route until stores are ready...');

    await Promise.all([collapseStore.untilReady, preferencesStore.untilReady]);

    // console.log('🟢 [Middleware] Stores are ready, allowing route:', to.path);
  }
});
