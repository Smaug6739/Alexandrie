/* types */
export type PreferenceKey = 'printMode' | 'darkMode' | 'hideTOC' | 'compactMode' | 'hideSidebarRessources' | 'normalizeFileIcons' | 'datatableItemsCount' | 'hideDock' | 'primaryColor' | 'docSize';

export interface Preference {
  key: PreferenceKey;
  value: any;
}

/* valeurs par défaut */
const DEFAULT_PREFERENCES: Record<PreferenceKey, any> = {
  printMode: false,
  darkMode: false,
  hideTOC: false,
  compactMode: false,
  hideSidebarRessources: false,
  normalizeFileIcons: true,
  datatableItemsCount: 10,
  hideDock: false,
  primaryColor: 1,
  docSize: 1, // 0: minimal, 1: large
};

/* utils */
function loadPreferences(): Preference[] {
  try {
    const raw = JSON.parse(localStorage.getItem('preferences') || '[]') as Preference[];
    const map = new Map(raw.map(p => [p.key, p.value]));

    // merge with default preferences
    return (Object.keys(DEFAULT_PREFERENCES) as PreferenceKey[]).map(key => ({
      key,
      value: map.has(key) ? map.get(key) : DEFAULT_PREFERENCES[key],
    }));
  } catch (e) {
    return Object.entries(DEFAULT_PREFERENCES).map(([key, value]) => ({
      key: key as PreferenceKey,
      value,
    }));
  }
}

function savePreferences(prefs: Preference[]) {
  localStorage.setItem('preferences', JSON.stringify(prefs));
}

/* pinia store */
export const usePreferencesStore = defineStore('preferences', {
  state: () => ({
    preferences: ref<Preference[]>(loadPreferences()),
  }),
  getters: {
    getAll: state => state.preferences,
    get: state => (key: PreferenceKey) => {
      const preference = state.preferences.find(p => p.key === key);
      return preference ? preference.value : DEFAULT_PREFERENCES[key];
    },
  },
  actions: {
    set(preference: Preference) {
      const existing = this.preferences.find(p => p.key === preference.key);
      if (existing) {
        existing.value = preference.value;
      } else {
        this.preferences.push(preference);
      }
      savePreferences(this.preferences);
    },
    reset() {
      this.preferences = Object.entries(DEFAULT_PREFERENCES).map(([key, value]) => ({
        key: key as PreferenceKey,
        value,
      }));
      savePreferences(this.preferences);
    },
  },
});
