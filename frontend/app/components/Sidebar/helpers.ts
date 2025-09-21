import type { Node } from '~/stores';

export type DefaultItem = Item<Omit<Node, 'user_id' | 'data' | 'show' | 'created_timestamp' | 'updated_timestamp'>>;
export interface Workspace {
  text: string;
  value?: string;
  meta?: Partial<Node>;
}
const sidebarItemsPrefs = usePreferences().get('sidebarItems');
export const navigationItems: DefaultItem[] = [
  {
    id: 'home',
    parent_id: '',
    label: 'Home',
    route: '/dashboard/home',
    icon: 'dashboard',
    data: {
      id: 'home',
      role: -1,
      name: 'Home',
      icon: 'dashboard',
      permissions: [],
      shared: false,
    },
    show: computed(() => sidebarItemsPrefs.value.home!),
  },
  {
    id: 'manage-categories',
    parent_id: '',
    label: 'Manage categories',
    route: '/dashboard/categories',
    icon: 'categories',
    data: {
      id: 'manage-categories',
      role: -1,
      name: 'Manage categories',
      icon: 'categories',
      permissions: [],
      shared: false,
    },
    show: computed(() => sidebarItemsPrefs.value.manageCategories!),
  },
  {
    id: 'cdn',
    parent_id: '',
    label: 'CDN',
    route: '/dashboard/cdn',
    icon: 'cdn',
    data: {
      id: 'cdn',
      role: -1,
      name: 'CDN',
      icon: 'cdn',
      permissions: [],
      shared: false,
    },
    show: computed(() => sidebarItemsPrefs.value.cdn!),
  },
  {
    id: 'settings',
    parent_id: '',
    label: 'Settings',
    route: '/dashboard/settings',
    icon: 'user_settings',
    data: {
      id: 'settings',
      role: -1,
      name: 'Settings',
      icon: 'user_settings',
      permissions: [],
      shared: false,
    },
    show: computed(() => sidebarItemsPrefs.value.settings!),
  },
  {
    id: 'documents',
    parent_id: '',
    label: 'Documents',
    route: '/dashboard/docs',
    icon: 'files',
    data: {
      id: 'documents',
      role: -1,
      name: 'Documents',
      icon: 'files',
      permissions: [],
      shared: false,
    },
    show: computed(() => sidebarItemsPrefs.value.documents!),
  },
  {
    id: 'importations',
    parent_id: '',
    label: 'Importations',
    route: '/dashboard/import',
    icon: 'import',
    data: {
      id: 'import',
      role: -1,
      name: 'Import',
      icon: 'import',
      permissions: [],
      shared: false,
    },
    show: computed(() => sidebarItemsPrefs.value.importation!),
  },
  {
    id: 'new-page',
    parent_id: '',
    label: 'New Page',
    route: '/dashboard/docs/new',
    icon: 'add_file',
    data: {
      id: 'new-page',
      role: -1,
      name: 'New Page',
      icon: 'add_file',
      permissions: [],
      shared: false,
    },
    show: computed(() => sidebarItemsPrefs.value.newPage!),
  },
];
