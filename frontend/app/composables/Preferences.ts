// composables/usePreferences.ts
import { ref, computed, watch } from 'vue';

export type PreferenceKey = keyof typeof DEFAULT_PREFERENCES;

export interface Preference {
  key: PreferenceKey;
  value: unknown;
}

const DEFAULT_PREFERENCES = {
  printMode: false,
  darkMode: false,
  hideTOC: false,
  compactMode: false,
  hideSidebarRessources: false,
  normalizeFileIcons: false,
  datatableItemsCount: 10,
  view_dock: true,
  primaryColor: -2, // -2 default primary; -1 unset; >= 0 app color index
  docSize: 1, // 0 = small, 1 = large
  sidebarCollapseItems: [],
  theme: 'alexandrie',
};

const preferences = ref<Preference[]>(loadPreferences());

function loadPreferences(): Preference[] {
  try {
    const raw = JSON.parse(localStorage.getItem('preferences') || '[]') as Preference[];
    const map = new Map(raw.map(p => [p.key, p.value]));

    return (Object.keys(DEFAULT_PREFERENCES) as PreferenceKey[]).map(key => ({
      key,
      value: map.has(key) ? map.get(key) : DEFAULT_PREFERENCES[key],
    }));
  } catch {
    return Object.entries(DEFAULT_PREFERENCES).map(([key, value]) => ({
      key: key as PreferenceKey,
      value,
    }));
  }
}

function savePreferences() {
  localStorage.setItem('preferences', JSON.stringify(preferences.value));
}

watch(preferences, savePreferences, { deep: true });

export function usePreferences() {
  function get(key: PreferenceKey) {
    const pref = preferences.value.find(p => p.key === key);
    return pref ? pref.value : DEFAULT_PREFERENCES[key];
  }

  function set(key: PreferenceKey, value: unknown) {
    const existing = preferences.value.find(p => p.key === key);
    if (existing) {
      existing.value = value;
    } else {
      preferences.value.push({ key, value });
    }
  }

  function reset() {
    preferences.value = Object.entries(DEFAULT_PREFERENCES).map(([key, value]) => ({
      key: key as PreferenceKey,
      value,
    }));
  }

  const all = computed(() => preferences.value);

  return {
    get,
    set,
    reset,
    all,
  };
}
