export function useTabsSync() {
  const tabs = useTabs();
  const nodesStore = useNodesStore();
  const route = useRoute();

  function resolveTabTitle(): string {
    if (route.params.id) {
      const node = nodesStore.getById(route.params.id as string);
      if (node && node.name) return node.name;
    }
    const name = route.path.split('/').pop() || 'Page';
    return name.charAt(0).toUpperCase() + name.slice(1);
  }

  watch(
    () => route.path,
    path => {
      tabs.syncCurrentTab({
        path,
        name: resolveTabTitle(),
      });
    },
    { immediate: true },
  );
}
