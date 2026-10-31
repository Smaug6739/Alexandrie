export default defineNuxtPlugin(() => {
  if (import.meta.client && 'serviceWorker' in navigator) {
    const config = useRuntimeConfig();

    navigator.serviceWorker.ready.then(registration => {
      if (registration.active) {
        registration.active.postMessage({
          type: 'SET_RUNTIME_CONFIG',
          payload: {
            BASE_URL: config.public.baseUrl,
            BASE_API: config.public.baseApi,
            BASE_CDN: config.public.baseCdn,
          },
        });
      }
    });
  }
});
