import SettingsModal from '~/pages/dashboard/settings/modal.vue';
import type { Node } from '~/stores';
import type { TreeItem } from '~/helpers/TreeBuilder';

export interface NavigationItem {
  id: string;
  parent_id?: string;
  label: string;
  route: string;
  icon: string;
  onClick?: () => void;
  data: {
    id: string;
    role: number;
    name: string;
    icon: string;
    permissions: unknown[];
    shared: boolean;
    order?: number;
  };
  show: Ref<boolean>;
}

export type DefaultItem = NavigationItem;

// Type union for sidebar items
export type SidebarItem = TreeItem<Node> | NavigationItem;

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
  text: string;
  value?: string;
  meta?: Partial<Node>;
}
const { isMobile } = useDevice();
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
    route: '',
    icon: 'user_settings',
    onClick: () => {
      if (isMobile.value) useRouter().push('/dashboard/settings');
      else useModal().add(new Modal(shallowRef(SettingsModal), { props: {}, size: 'large', noPadding: true }));
    },
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
