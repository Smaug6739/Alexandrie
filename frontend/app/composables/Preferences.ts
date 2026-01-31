import type { ANode } from './TreeStructure';

export const DEFAULT_PREFERENCES = {
  printMode: false as boolean,
  darkMode: false as boolean,
  hideTOC: false as boolean,
  compactMode: false as boolean,
  hideSidebarResources: false as boolean,
  normalizeFileIcons: false as boolean,
  displayUncategorizedResources: true as boolean,
  datatableItemsCount: 10 as number,
  view_dock: true as boolean,
  primaryColor: -2 as number, // -2 default primary; -1 unset; >= 0 app color index
  docSize: 1 as number, // 0 = small, 1 = large
  theme: 'alexandrie' as string,
  documentAutoSave: true as boolean, // Enable automatic saving of documents
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
  snippets: [
    { id: ':::blue', label: ':::blue\n${0}\n:::' },
    { id: ':::green', label: ':::green\n${0}\n:::' },
    { id: ':::yellow', label: ':::yellow\n${0}\n:::' },
    { id: ':::grey', label: ':::grey\n${0}\n:::' },
    { id: ':::details', label: ':::details\n${0}\n:::' },
    { id: ':::center', label: ':::center\n${0}\n:::' },
    { id: ':::m', label: '${0}$' },
    { id: ':::property', label: ':::property ${0}\n\n:::' },
    { id: ':::warning', label: ':::warning ${0}\n\n:::' },
  ] as ANode<string>[],
  editorFontFamily: 'JetBrains Mono' as string,
  editorFontSize: 14 as number,
  editorSpellCheck: true as boolean,
  editorDisplayStats: false as boolean,
  editorSnippetsEnabled: true as boolean,
  editorSimplifiedViewOnMobile: true as boolean,
  developerMode: false as boolean,
};

// Crée un type mapping automatique : chaque clé => type exact
export type Preferences = {
  [K in keyof typeof DEFAULT_PREFERENCES]: (typeof DEFAULT_PREFERENCES)[K];
};
export type PreferenceKey = keyof Preferences;

const preferences = reactive<Preferences>(loadPreferences());

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
  localStorage.setItem('preferences', JSON.stringify(preferences));
}

export function usePreferences() {
  function get<K extends PreferenceKey>(key: K) {
    return computed<Preferences[K]>({
      get: () => preferences[key] as Preferences[K],
      set: val => {
        preferences[key] = val;
        savePreferences();
      },
    });
  }

  function set<K extends PreferenceKey>(key: K, value: Preferences[K]) {
    preferences[key] = value;
    savePreferences();
  }

  function reset() {
    Object.assign(preferences, DEFAULT_PREFERENCES);
    savePreferences();
  }

  function importPreferences(newPreferences: Partial<Preferences>) {
    Object.assign(preferences, newPreferences);
    savePreferences();
  }

  const all = preferences;

  return {
    get,
    set,
    reset,
    importPreferences,
    all,
  };
}

type OptionType = 'toggle' | 'select' | 'color' | 'radio' | 'groupCheckbox' | 'anode';
interface BaseOption<K extends PreferenceKey = PreferenceKey> {
  label: string;
  description?: string;
  type: OptionType;
  key: K;
  onChange?: (value: Preferences[K]) => void;
}
interface ToggleOption<K extends PreferenceKey = PreferenceKey> extends BaseOption<K> {
  type: 'toggle';
}

interface ColorOption<K extends PreferenceKey = PreferenceKey> extends BaseOption<K> {
  type: 'color';
  items: Array<{ label: string; id: string | number }>;
  onChange?: (value: Preferences[K]) => void;
}
interface SelectOption<K extends PreferenceKey = PreferenceKey> extends BaseOption<K> {
  type: 'select';
  choices: ANode[];
  onChange?: (value: Preferences[K]) => void;
}
interface RadioOption<K extends PreferenceKey = PreferenceKey> extends BaseOption<K> {
  type: 'radio';
  choices: Array<{ id: number | string; label: string }>;
  onChange?: (value: Preferences[K]) => void;
}

interface GroupCheckboxOption<K extends PreferenceKey = PreferenceKey> extends BaseOption<K> {
  type: 'groupCheckbox';
  items: Record<string, string>;
  onChange?: (value: Preferences[K]) => void;
}

interface AnodeOption<K extends PreferenceKey = PreferenceKey> extends BaseOption<K> {
  type: 'anode';
  onChange?: (value: Preferences[K]) => void;
}

export type Option = ToggleOption | ColorOption | SelectOption | RadioOption | GroupCheckboxOption | AnodeOption;
export type { ColorOption, SelectOption, RadioOption, ToggleOption, GroupCheckboxOption, AnodeOption };
