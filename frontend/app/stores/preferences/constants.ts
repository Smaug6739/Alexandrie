import type { TreeNode } from '~/helpers/TreeBuilder';

export type ANode<ID = string | number> = Omit<TreeNode<unknown, ID>, 'data'>;

export const DEFAULT_PREFERENCES = {
  locale: 'en' as 'en' | 'fr',
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
  style: 'default' as 'default' | 'glassmorphism',
  theme: 'alexandrie' as string,
  documentAutoSave: true as boolean, // Enable automatic saving of documents
  documentFontSize: 16 as number,
  documentFontFamily: 'Poppins' as string,
  documentLineHeight: 1.5 as number,
  sidebarItems: {
    manageCategories: true as boolean,
    cdn: true as boolean,
    settings: true as boolean,
    home: true as boolean,
    importation: false as boolean,
    documents: false as boolean,
    newPage: false as boolean,
  } as const,
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
  stylesInjectionEnabled: false as boolean,
  stylesInjection: '' as string,
  stylesDocumentsInjection: '' as string,
  defaultUploadFolder: null as string | null,
};

export type Preferences = {
  [K in keyof typeof DEFAULT_PREFERENCES]: (typeof DEFAULT_PREFERENCES)[K];
};
export type PreferenceKey = keyof Preferences;

// ─── Key mapping: which preference keys go to which backend JSON column ───
export const GENERAL_KEYS: PreferenceKey[] = [
  'locale',
  'printMode',
  'darkMode',
  'hideTOC',
  'compactMode',
  'hideSidebarResources',
  'normalizeFileIcons',
  'displayUncategorizedResources',
  'datatableItemsCount',
  'view_dock',
  'primaryColor',
  'docSize',
  'style',
  'theme',
];

export const EDITOR_KEYS: PreferenceKey[] = [
  'documentAutoSave',
  'documentFontSize',
  'documentFontFamily',
  'documentLineHeight',
  'editorFontFamily',
  'editorFontSize',
  'editorSpellCheck',
  'editorDisplayStats',
  'editorSnippetsEnabled',
  'editorSimplifiedViewOnMobile',
];

export const ADVANCED_KEYS: PreferenceKey[] = [
  'sidebarItems',
  'navbarItems',
  'snippets',
  'developerMode',
  'stylesInjectionEnabled',
  'stylesInjection',
  'stylesDocumentsInjection',
  'defaultUploadFolder',
];
