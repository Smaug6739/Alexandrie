// composables/usePreferences.ts
import { ref, computed, watch } from 'vue';

export type PreferenceKey = 'printMode' | 'darkMode' | 'hideTOC' | 'compactMode' | 'hideSidebarRessources' | 'normalizeFileIcons' | 'datatableItemsCount' | 'view_dock' | 'primaryColor' | 'docSize' | 'sidebarCollapseItems';

export interface Preference {
  key: PreferenceKey;
  value: any;
}

const DEFAULT_PREFERENCES: Record<PreferenceKey, any> = {
  printMode: false,
  darkMode: false,
  hideTOC: false,
  compactMode: false,
  hideSidebarRessources: false,
  normalizeFileIcons: false,
  datatableItemsCount: 10,
  view_dock: true,
  primaryColor: 0,
  docSize: 1, // 0 = small, 1 = large
  sidebarCollapseItems: [],
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

  function set(key: PreferenceKey, value: any) {
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
