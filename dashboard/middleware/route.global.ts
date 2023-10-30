export default defineNuxtRouteMiddleware((to, from) => {
  const mergedQuery = { ...from.query, ...to.query };
  if (JSON.stringify(to.query) !== JSON.stringify(mergedQuery)) {
    return navigateTo({
      path: to.path,
      query: mergedQuery,
    });
  }
});
