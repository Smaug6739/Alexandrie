import { DEFAULT_PREFERENCES, ADVANCED_KEYS, EDITOR_KEYS, GENERAL_KEYS, type Preferences } from './constants';

interface BackendSettings {
  user_id: number;
  general: Record<string, unknown>;
  editor: Record<string, unknown>;
  advanced: Record<string, unknown>;
}

function loadLocalPreferences(): Preferences {
  if (!import.meta.client) return { ...DEFAULT_PREFERENCES };
  try {
    const raw = JSON.parse(localStorage.getItem('preferences') || '{}') as Partial<Preferences>;
    return {
      ...DEFAULT_PREFERENCES,
      ...raw,
    };
  } catch {
    return { ...DEFAULT_PREFERENCES };
  }
}

export const usePreferencesStore = defineStore('preferences', () => {
  const preferences = reactive<Preferences>(loadLocalPreferences());

  const debouncedSync = useDebounceFn(syncToBackend, 1500);

  function savePreferences() {
    if (!import.meta.client) return;
    localStorage.setItem('preferences', JSON.stringify(preferences));
    debouncedSync();
  }

  // ─── Backend sync helpers ───

  function pickKeys(keys: PreferenceKey[]): Record<string, unknown> {
    const result: Record<string, unknown> = {};
    for (const k of keys) result[k] = preferences[k];
    return result;
  }

  function splitForBackend(): { general: Record<string, unknown>; editor: Record<string, unknown>; advanced: Record<string, unknown> } {
    return {
      general: pickKeys(GENERAL_KEYS),
      editor: pickKeys(EDITOR_KEYS),
      advanced: pickKeys(ADVANCED_KEYS),
    };
  }

  function groupFromBackend(settings: Partial<BackendSettings>): Preferences {
    return {
      ...DEFAULT_PREFERENCES,
      ...settings.general,
      ...settings.editor,
      ...settings.advanced,
    } as Preferences;
  }

  function mergeFromBackend(settings: BackendSettings) {
    const remote: Partial<Preferences> = {
      ...settings.general,
      ...settings.editor,
      ...settings.advanced,
    } as Partial<Preferences>;
    // Merge: default ← remote ← (keep any local keys not in remote, to handle new defaults)
    const merged: Preferences = { ...DEFAULT_PREFERENCES };
    for (const key of Object.keys(merged) as PreferenceKey[]) {
      if (key in remote && remote[key] !== undefined && remote[key] !== null) {
        (merged as Record<string, unknown>)[key] = remote[key];
      }
    }
    Object.assign(preferences, merged);
    if (import.meta.client) localStorage.setItem('preferences', JSON.stringify(preferences));
  }

  async function syncToBackend() {
    if (!import.meta.client) return;
    if (localStorage.getItem('isLoggedIn') !== 'true') return;

    try {
      await makeRequest('user/settings', 'PUT', splitForBackend());
    } catch (e) {
      console.warn('[Preferences] Failed to sync to backend', e);
    }
  }

  async function fetchFromBackend() {
    if (!import.meta.client) return;
    if (localStorage.getItem('isLoggedIn') !== 'true') return;
    try {
      const response = await makeRequest<BackendSettings>('user/settings', 'GET');
      if (response.status === 'success' && response.result) {
        mergeFromBackend(response.result);
      }
    } catch (e) {
      console.warn('[Preferences] Failed to fetch from backend', e);
    }
  }
  const computedCache = new Map<PreferenceKey, WritableComputedRef<Preferences[PreferenceKey]>>();
  function get<K extends PreferenceKey>(key: K): WritableComputedRef<Preferences[K]> {
    let existing = computedCache.get(key) as WritableComputedRef<Preferences[K]> | undefined;

    if (!existing) {
      existing = computed<Preferences[K]>({
        get: () => preferences[key],
        set: val => {
          preferences[key] = val;
          savePreferences();
        },
      });

      computedCache.set(key, existing);
    }
    return existing;
  }

  function set<K extends PreferenceKey>(key: K, value: Preferences[K]) {
    preferences[key] = value;
    savePreferences();
  }

  function reset() {
    Object.assign(preferences, DEFAULT_PREFERENCES);
    savePreferences();
  }

  function importPreferences(newPreferences: Partial<BackendSettings>) {
    Object.assign(preferences, groupFromBackend(newPreferences));
    savePreferences();
  }

  /** Force a full push to backend (e.g. after import) */
  function syncNow() {
    debouncedSync();
  }

  return {
    get,
    set,
    reset,
    importPreferences,
    fetchFromBackend,
    syncNow,
    preferences,
  };
});
