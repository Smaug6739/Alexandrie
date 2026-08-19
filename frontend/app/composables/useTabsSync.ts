export function useTabsSync() {
  const tabsStore = useTabsStore();
  const nodesStore = useNodesStore();
  const route = useRoute();
  const { t } = useI18nT();

  function resolveTabTitle(): string {
    if (route.params.id) {
      const node = nodesStore.getById(route.params.id as string);
      if (node?.name) return node.name;
    }

    let i = route.matched.length - 1;
    let page = route.matched[i];
    while (page && !page.meta?.breadcrumb && i > 0) {
      i--;
      page = route.matched[i];
    }

    const breadcrumb = page?.meta?.breadcrumb;
    if (breadcrumb) {
      if (typeof breadcrumb === 'function') {
        return breadcrumb(route);
      }
      if (typeof breadcrumb === 'object' && 'i18n' in breadcrumb) {
        const { c, i18n } = breadcrumb as { c?: number; i18n: string };
        // @ts-expect-error: t() can accept a count parameter
        return t(i18n, { count: c });
      }
      if (typeof breadcrumb === 'string') {
        return breadcrumb;
      }
    }

    return 'Page';
  }

  watch(
    () => route.path,
    path => {
      if (!path.startsWith('/dashboard')) return;

      tabsStore.syncTab({
        path,
        name: resolveTabTitle(),
        id: route.params.id as string,
      });
    },
    { immediate: true },
  );
}
