/* Store to save user local preferences */
/* Only local settings with localStorage but no db or requests */
export type PreferenceKey = 'printMode' | 'darkMode' | 'hideTOC' | 'compactMode' | 'hideSidebarRessources' | 'normalizeFileIcons';
export interface Preference {
  key: PreferenceKey;
  value: any;
}

export const usePreferencesStore = defineStore('preferences', {
  state: () => ({
    preferences: ref<Preference[]>(JSON.parse(localStorage.getItem('preferences') || '[]')),
  }),
  getters: {
    getAll: state => state.preferences,
    get: state => (key: PreferenceKey) => {
      const preference = state.preferences.find(p => p.key === key);
      return preference ? preference.value : null;
    },
  },
  actions: {
    // Set a preference (or update if it already exists)
    set: function (preference: Preference) {
      const existing = this.preferences.find(p => p.key === preference.key);
      if (existing) {
        existing.value = preference.value;
      } else {
        this.preferences.push(preference);
      }
      localStorage.setItem('preferences', JSON.stringify(this.preferences));
    },
  },
});
