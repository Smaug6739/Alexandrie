export interface Tab {
  path: string;
  name: string;
}

export interface TabsStore {
  tabs: Tab[];
  indexActiveTab: number;
}

const STORAGE_KEY = 'tabs';

const createHomeTab = (): Tab => ({
  path: '/dashboard/home',
  name: 'Home',
});

const loadStoredTabs = (): TabsStore | null => {
  if (!import.meta.client) return null;

  const rawTabs = localStorage.getItem(STORAGE_KEY);
  if (!rawTabs) return null;

  try {
    const parsed = JSON.parse(rawTabs) as Partial<TabsStore>;

    return {
      tabs: Array.isArray(parsed.tabs) ? parsed.tabs : [],
      indexActiveTab: typeof parsed.indexActiveTab === 'number' ? parsed.indexActiveTab : 0,
    };
  } catch {
    return null;
  }
};

export const useTabs = defineStore('tabs', {
  state: (): TabsStore => ({
    tabs: [],
    indexActiveTab: 0,
  }),
  actions: {
    setup() {
      const storedTabs = loadStoredTabs();
      if (storedTabs) {
        this.$patch(storedTabs);
      }
    },
    saveTabs() {
      if (!import.meta.client) return;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.$state));
    },

    syncCurrentTab(tab: Tab): void {
      const index = this.tabs.findIndex(existingTab => existingTab.path === tab.path);

      if (index !== -1) {
        this.indexActiveTab = index;
        this.tabs[index] = tab;
        return;
      }

      if (this.tabs.length === 0) {
        this.tabs.push(tab);
        this.indexActiveTab = 0;
        return;
      }

      this.tabs[this.indexActiveTab] = tab;
    },

    addTab(tab: Tab = createHomeTab()): Tab {
      this.tabs.push(tab);
      this.indexActiveTab = this.tabs.length - 1;

      return tab;
    },

    setActive(index: number): void {
      this.indexActiveTab = index;
    },

    closeTab(index: number): Tab | null {
      const wasActive = this.indexActiveTab === index;

      this.tabs.splice(index, 1);

      if (this.indexActiveTab > index) {
        this.indexActiveTab--;
      }

      if (this.tabs.length === 0) {
        const tab = this.addTab();
        return tab;
      }

      if (wasActive) {
        const nextIndex = Math.min(index, this.tabs.length - 1);
        this.indexActiveTab = nextIndex;

        return this.tabs[nextIndex] ?? null;
      }

      return null;
    },
  },
  getters: {
    activeTab(): Tab {
      return this.tabs[this.indexActiveTab]!;
    },
  },
});
