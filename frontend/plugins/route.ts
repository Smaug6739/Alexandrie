import Loader from '@/utils/Loader';

const loader = new Loader();

export default defineNuxtPlugin(_ => {
  const router = useRouter();

  // Every time the route changes (fired on initialization too)
  router.beforeResolve((to, _, next) => {
    if (to.name && process.client) {
      loader.start();
    }
    next();
  });

  router.afterEach(() => {
    if (process.client) loader.stop();
  });
});
