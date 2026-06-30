import localForage from 'localforage';
import { DEFAULT_PREFERENCES, ADVANCED_KEYS, EDITOR_KEYS, GENERAL_KEYS, type Preferences } from './constants';

interface BackendSettings {
  user_id: number;
  general: Record<string, unknown>;
  editor: Record<string, unknown>;
  advanced: Record<string, unknown>;
}

const isReady = ref(false);
let resolveReady: () => void;

const untilReady = new Promise<void>(resolve => {
  resolveReady = resolve;
});

export const usePreferencesStore = defineStore('preferences', () => {
  const preferences = reactive<Preferences>({ ...DEFAULT_PREFERENCES });

  const debouncedSync = useDebounceFn(syncToBackend, 1500);

  async function initStore() {
    console.log('🏬 [Preferences] Initializing store...');
    if (!import.meta.client) return;
    try {
      const raw = await localForage.getItem<Partial<Preferences>>('preferences');
      if (raw) {
        Object.assign(preferences, {
          ...DEFAULT_PREFERENCES,
          ...raw,
        });
      }
    } catch (e) {
      console.warn('[Preferences] Failed to load local preferences', e);
    } finally {
      resolveReady();
      isReady.value = true;
    }
  }

  initStore();

  function savePreferences() {
    if (!isReady.value) return;
    if (!import.meta.client) return;

    const rawPreferences = toRaw(preferences);

    localForage.setItem('preferences', rawPreferences).catch(e => {
      console.error('[Preferences] Failed to save to localForage', e);
    });

    debouncedSync();
  }

  // ─── Backend sync helpers ───

  function pickKeys(keys: PreferenceKey[]): Record<string, unknown> {
    const result: Record<string, unknown> = {};
    for (const k of keys) result[k] = preferences[k];
    return result;
  }

  function splitForBackend() {
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

    const merged: Preferences = { ...DEFAULT_PREFERENCES };
    for (const key of Object.keys(merged) as PreferenceKey[]) {
      if (key in remote && remote[key] !== undefined && remote[key] !== null) {
        (merged as Record<string, unknown>)[key] = remote[key];
      }
    }
    Object.assign(preferences, merged);
    if (import.meta.client) {
      localForage.setItem('preferences', toRaw(preferences));
    }
  }

  async function syncToBackend() {
    if (!import.meta.client) return;
    const isLoggedIn = await localForage.getItem('isLoggedIn');
    if (!isLoggedIn) return;

    try {
      await makeRequest('user/settings', 'PUT', splitForBackend());
    } catch (e) {
      console.warn('[Preferences] Failed to sync to backend', e);
    }
  }

  async function fetchFromBackend() {
    if (!import.meta.client) return;
    const isLoggedIn = await localForage.getItem('isLoggedIn');
    if (!isLoggedIn) return;
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
    let existing = computedCache.get(key);

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
    // @ts-expect-error Correctly typed, but TypeScript doesn't infer it well here
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

  function syncNow() {
    debouncedSync();
  }

  return {
    untilReady,
    get,
    set,
    reset,
    importPreferences,
    fetchFromBackend,
    syncNow,
    preferences,
  };
});
