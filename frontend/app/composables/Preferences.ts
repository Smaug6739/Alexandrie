export const DEFAULT_PREFERENCES = {
  printMode: false as boolean,
  darkMode: false as boolean,
  hideTOC: false as boolean,
  compactMode: false as boolean,
  hideSidebarRessources: false as boolean,
  normalizeFileIcons: false as boolean,
  datatableItemsCount: 10 as number,
  view_dock: true as boolean,
  primaryColor: -2 as number, // -2 default primary; -1 unset; >= 0 app color index
  docSize: 1 as number, // 0 = small, 1 = large
  theme: 'alexandrie' as string,
  sidebarItems: {
    manageCategories: true as boolean,
    cdn: true as boolean,
    settings: true as boolean,
    home: true as boolean,
    importation: false as boolean,
    documents: false as boolean,
    newPage: false as boolean,
  } as Record<string, boolean>,
  navbarItems: {
    breadcrumb: true as boolean,
    search: true as boolean,
    theme: true as boolean,
    navigation: true as boolean,
  },
};

// Crée un type mapping automatique : chaque clé => type exact
export type Preferences = {
  [K in keyof typeof DEFAULT_PREFERENCES]: (typeof DEFAULT_PREFERENCES)[K];
};
export type PreferenceKey = keyof Preferences;

const preferences = ref<Preferences>(loadPreferences());

function loadPreferences(): Preferences {
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

function savePreferences() {
  localStorage.setItem('preferences', JSON.stringify(preferences.value));
}

watch(preferences, savePreferences, { deep: true });

export function usePreferences() {
  function get<K extends PreferenceKey>(key: K) {
    // Crée un ref réactif lié à la valeur des preferences
    const r = ref(preferences.value[key]) as Ref<Preferences[K]>;

    // Watch pour propager les changements dans le store
    watch(
      r,
      val => {
        preferences.value[key] = val;
      },
      { deep: true },
    );

    return r;
  }

  function set<K extends PreferenceKey>(key: K, value: Preferences[K]) {
    preferences.value[key] = value;
  }

  function reset() {
    preferences.value = { ...DEFAULT_PREFERENCES };
  }

  const all = computed(() => preferences.value);

  return {
    get,
    set,
    reset,
    all,
  };
}

type OptionType = 'toggle' | 'select' | 'color' | 'radio' | 'groupCheckbox';
interface BaseOption<T = unknown> {
  label: string;
  type: OptionType;
  key: PreferenceKey;
  onChange?: (value: T) => void;
}
interface ToggleOption extends BaseOption<boolean> {
  type: 'toggle';
  value: boolean;
  onChange?: (value: boolean) => void;
}
interface ColorOption extends BaseOption<number> {
  type: 'color';
  value: number;
  onChange?: (value: number) => void;
}
interface SelectOption extends BaseOption<number | string> {
  type: 'select';
  value: number | string;
  choices: ANode[];
  onChange?: (value: number | string) => void;
}
interface RadioOption extends BaseOption<number | string> {
  type: 'radio';
  value: number | string;
  choices: Array<{ id: number | string; label: string }>;
  onChange?: (value: number | string) => void;
}

interface GroupCheckboxOption extends BaseOption<Record<string, boolean>> {
  type: 'groupCheckbox';
  // Les sous-options sont un objet clé => label
  items: Record<string, string>;
  value: Record<string, boolean>;
  onChange?: (value: Record<string, boolean>) => void;
}

export type Option = ToggleOption | ColorOption | SelectOption | RadioOption | GroupCheckboxOption;
export type { ColorOption, SelectOption, RadioOption, ToggleOption, GroupCheckboxOption };
