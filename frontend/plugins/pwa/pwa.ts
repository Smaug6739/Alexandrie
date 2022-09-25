export default defineNuxtPlugin(() => {
  if (!process.client) return;
  console.log('PWA plugin loaded!');

  if ('serviceWorker' in navigator) {
    console.log('Service Worker is supported');

    navigator.serviceWorker
      .register('/service-worker.js')
      .then(
        function (/*registration*/) {
          // Registration was successful
          console.log('Registered!');
        },
        function (err) {
          // registration failed :(
          console.log('ServiceWorker registration failed: ', err);
        },
      )
      .catch(function (err) {
        console.log(err);
      });
  } else {
    console.log('service worker is not supported');
  }
  // service-worker.js
});
