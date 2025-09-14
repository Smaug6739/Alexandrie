import type { Node } from '~/stores';

export interface DefaultItem {
  id: string;
  type: 'navigation';
  role: -1; // 0: Navigation item
  label: string;
  icon?: string;
  route: string;
  childrens: DefaultItem[];
}
export interface Workspace {
  text: string;
  value?: string;
  meta?: Partial<Node>;
}
const sidebarItemsPrefs = usePreferences().get('sidebarItems');
export const navigationItems: Item<DefaultItem>[] = [
  {
    id: 'home',
    parent_id: '',
    label: 'Home',
    route: '/dashboard/home',
    icon: 'dashboard',
    data: {
      id: 'home',
      type: 'navigation',
      role: -1,
      label: 'Home',
      icon: 'dashboard',
      route: '/dashboard/home',
      childrens: [],
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
      type: 'navigation',
      role: -1,
      label: 'Manage categories',
      icon: 'categories',
      route: '/dashboard/categories',
      childrens: [],
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
      type: 'navigation',
      role: -1,
      label: 'CDN',
      icon: 'cdn',
      route: '/dashboard/cdn',
      childrens: [],
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
      type: 'navigation',
      role: -1,
      label: 'Settings',
      icon: 'user_settings',
      route: '/dashboard/settings',
      childrens: [],
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
      type: 'navigation',
      role: -1,
      label: 'Documents',
      icon: 'files',
      route: '/dashboard/docs',
      childrens: [],
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
      type: 'navigation',
      role: -1,
      label: 'Import',
      icon: 'import',
      route: '/dashboard/import',
      childrens: [],
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
      type: 'navigation',
      role: -1,
      label: 'New Page',
      icon: 'add_file',
      route: '/dashboard/docs/new',
      childrens: [],
    },
    show: computed(() => sidebarItemsPrefs.value.newPage!),
  },
];
