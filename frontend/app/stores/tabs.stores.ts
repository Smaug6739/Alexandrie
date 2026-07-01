import localForage from 'localforage';

export interface Tab {
  path: string;
  name: string;
  id?: string;
}

const STORAGE_KEY = 'app-tabs';

export const useTabsStore = defineStore('tabs', () => {
  const tabs = ref<Tab[]>([]);

  if (import.meta.client) {
    localForage
      .getItem<Tab[]>(STORAGE_KEY)
      .then(saved => {
        if (saved) {
          tabs.value = saved;
        }
      })
      .catch(_ => (tabs.value = []));
  }

  watch(
    tabs,
    async newTabs => {
      if (import.meta.client) await localForage.setItem(STORAGE_KEY, toRaw(newTabs));
    },
    { deep: true },
  );

  function syncTab(tab: Tab) {
    const exists = tabs.value.some(t => t.path === tab.path);
    if (!exists) {
      tabs.value.push(tab);
    }
  }

  function closeTab(path: string, currentPath: string): string | null {
    const index = tabs.value.findIndex(t => t.path === path);
    if (index === -1) return null;

    tabs.value.splice(index, 1);

    if (currentPath === path) {
      if (tabs.value.length > 0) {
        const nextTab = tabs.value[index - 1] || tabs.value[0];
        return nextTab!.path;
      }
      return '/dashboard/home';
    }

    return null;
  }

  return {
    tabs,
    syncTab,
    closeTab,
  };
});
