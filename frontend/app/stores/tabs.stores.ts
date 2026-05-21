export interface Tab {
  path: string;
  name: string;
}

export interface TabsStore {
  tabs: Tab[];
  indexActiveTab: number;
}

const loadStoredTabs = (): TabsStore => {
  const raw = JSON.parse(localStorage.getItem('tabs') || '{}');

  return { ...raw };
};

export const useTabs = defineStore('tabs', {
  state: (): TabsStore => ({
    tabs: [],
    indexActiveTab: 0,
  }),
  actions: {
    setup() {
      this.$patch(loadStoredTabs());
    },
    saveTabs() {
      if (!import.meta.client) return;
      localStorage.setItem('tabs', JSON.stringify(this.$state));
    },

    // Watch if the route change and update the Tab item
    initWatcher(): void {
      const route = useRoute();

      watch(
        () => route.path,
        path => {
          const index = this.tabs.findIndex(tab => tab.path === path);

          // Existing tab
          if (index !== -1) {
            this.indexActiveTab = index;
            return;
          }

          const name = getPageName(path);

          // Replace current active tab
          this.tabs[this.indexActiveTab] = {
            path,
            name,
          };
        },
        { immediate: true },
      );
    },

    addTab(): void {
      this.tabs.push({
        path: '/dashboard/home',
        name: 'Home',
      });
      this.indexActiveTab = this.tabs.length - 1;

      navigateTo('/dashboard/home');
    },

    setActive(index: number): void {
      this.indexActiveTab = index;

      navigateTo(this.tabs[index]!.path);
    },

    async closeTab(index: number): Promise<void> {
      const wasActive = this.indexActiveTab === index;

      this.tabs.splice(index, 1);

      if (this.indexActiveTab > index) {
        this.indexActiveTab--;
      }

      if (wasActive) {
        if (this.tabs.length === 0) {
          this.addTab();
          return;
        }

        const nextIndex = Math.min(index, this.tabs.length - 1);

        this.setActive(nextIndex);
      }
    },
  },
  getters: {
    activeTab(): Tab {
      return this.tabs[this.indexActiveTab]!;
    },
  },
});

const getPageName = (path: string): string => {
  const name = path.split('/').pop() || 'Page';

  if (path.includes('docs')) {
    if (path.split('/').length === 3) {
      return 'Docs';
    }
    return getDocName(name) || 'Page';
  }

  return name;
};

const getDocName = (id?: string): string | undefined => {
  const nodesStores = useNodesStore();

  if (!id) return;

  const doc = nodesStores.getById(id);

  return doc?.name;
};
