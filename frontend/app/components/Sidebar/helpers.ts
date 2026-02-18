import type { TreeItem } from '~/helpers/TreeBuilder';
import type { Node } from '~/stores';

import SettingsModal from '~/pages/dashboard/settings/modal.vue';

export interface NavigationItem {
  data: {
    id: string;
    role: number;
    name: string;
    icon: string;
    permissions: unknown[];
    shared: boolean;
    order?: number;
  };
  icon: string;
  id: string;
  label: string;
  onClick?: () => void;
  parent_id?: string;
  route: string;
  show: Ref<boolean>;
}

export type DefaultItem = NavigationItem;

// Type union for sidebar items
export type SidebarItem = NavigationItem | TreeItem<Node>;

// Helper to get children of a sidebar item with type safety
export function getItemChildren(item: SidebarItem): SidebarItem[] | undefined {
  if ('children' in item) return item.children as SidebarItem[];
  return undefined;
}

// Helper to check if a sidebar item is visible
export function isItemVisible(item: SidebarItem): boolean {
  if ('show' in item && item.show) return item.show.value;
  return true;
}

export interface Workspace {
  meta?: Partial<Node>;
  text: string;
  value?: string;
}
const { isMobile } = useDevice();
const sidebarItemsPrefs = usePreferences().get('sidebarItems');
export const navigationItems: DefaultItem[] = [
  {
    data: {
      icon: 'dashboard',
      id: 'home',
      name: 'components.sidebar.nav.home',
      permissions: [],
      role: -1,
      shared: false,
    },
    icon: 'dashboard',
    id: 'home',
    label: 'components.sidebar.nav.home',
    parent_id: '',
    route: '/dashboard/home',
    show: computed(() => sidebarItemsPrefs.value.home!),
  },
  {
    data: {
      icon: 'categories',
      id: 'manage-categories',
      name: 'components.sidebar.nav.manageCategories',
      permissions: [],
      role: -1,
      shared: false,
    },
    icon: 'categories',
    id: 'manage-categories',
    label: 'components.sidebar.nav.manageCategories',
    parent_id: '',
    route: '/dashboard/categories',
    show: computed(() => sidebarItemsPrefs.value.manageCategories!),
  },
  {
    data: {
      icon: 'cdn',
      id: 'cdn',
      name: 'components.sidebar.nav.cdn',
      permissions: [],
      role: -1,
      shared: false,
    },
    icon: 'cdn',
    id: 'cdn',
    label: 'components.sidebar.nav.cdn',
    parent_id: '',
    route: '/dashboard/cdn',
    show: computed(() => sidebarItemsPrefs.value.cdn!),
  },
  {
    data: {
      icon: 'user_settings',
      id: 'settings',
      name: 'components.sidebar.nav.settings',
      permissions: [],
      role: -1,
      shared: false,
    },
    icon: 'user_settings',
    id: 'settings',
    label: 'components.sidebar.nav.settings',
    onClick: () => {
      if (isMobile.value) useRouter().push('/dashboard/settings');
      else useModal().add(new Modal(shallowRef(SettingsModal), { noPadding: true, props: {}, size: 'large' }));
    },
    parent_id: '',
    route: '',
    show: computed(() => sidebarItemsPrefs.value.settings!),
  },
  {
    data: {
      icon: 'files',
      id: 'documents',
      name: 'components.sidebar.nav.documents',
      permissions: [],
      role: -1,
      shared: false,
    },
    icon: 'files',
    id: 'documents',
    label: 'components.sidebar.nav.documents',
    parent_id: '',
    route: '/dashboard/docs',
    show: computed(() => sidebarItemsPrefs.value.documents!),
  },
  {
    data: {
      icon: 'import',
      id: 'import',
      name: 'components.sidebar.nav.imports',
      permissions: [],
      role: -1,
      shared: false,
    },
    icon: 'import',
    id: 'importations',
    label: 'components.sidebar.nav.imports',
    parent_id: '',
    route: '/dashboard/import',
    show: computed(() => sidebarItemsPrefs.value.importation!),
  },
  {
    data: {
      icon: 'add_file',
      id: 'new-page',
      name: 'components.sidebar.nav.newPage',
      permissions: [],
      role: -1,
      shared: false,
    },
    icon: 'add_file',
    id: 'new-page',
    label: 'components.sidebar.nav.newPage',
    parent_id: '',
    route: '/dashboard/docs/new',
    show: computed(() => sidebarItemsPrefs.value.newPage!),
  },
];
