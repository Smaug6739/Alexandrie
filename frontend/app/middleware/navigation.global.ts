export default defineNuxtRouteMiddleware(async (to, _) => {
  if (!import.meta.client) return;
  useSidebar().active_id.value = to.params.id as string | null;
});
