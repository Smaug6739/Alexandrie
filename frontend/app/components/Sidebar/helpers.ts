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
    label: 'components.sidebar.nav.home',
    route: '/dashboard/home',
    icon: 'dashboard',
    data: {
      id: 'home',
      role: -1,
      name: 'components.sidebar.nav.home',
      icon: 'dashboard',
      permissions: [],
      shared: false,
    },
    show: computed(() => sidebarItemsPrefs.value.home!),
  },
  {
    id: 'manage-categories',
    parent_id: '',
    label: 'components.sidebar.nav.manageCategories',
    route: '/dashboard/categories',
    icon: 'categories',
    data: {
      id: 'manage-categories',
      role: -1,
      name: 'components.sidebar.nav.manageCategories',
      icon: 'categories',
      permissions: [],
      shared: false,
    },
    show: computed(() => sidebarItemsPrefs.value.manageCategories!),
  },
  {
    id: 'cdn',
    parent_id: '',
    label: 'components.sidebar.nav.cdn',
    route: '/dashboard/cdn',
    icon: 'cdn',
    data: {
      id: 'cdn',
      role: -1,
      name: 'components.sidebar.nav.cdn',
      icon: 'cdn',
      permissions: [],
      shared: false,
    },
    show: computed(() => sidebarItemsPrefs.value.cdn!),
  },
  {
    id: 'settings',
    parent_id: '',
    label: 'components.sidebar.nav.settings',
    route: '',
    icon: 'user_settings',
    onClick: () => {
      if (isMobile.value) useRouter().push('/dashboard/settings');
      else useModal().add(new Modal(shallowRef(SettingsModal), { props: {}, size: 'large', noPadding: true }));
    },
    data: {
      id: 'settings',
      role: -1,
      name: 'components.sidebar.nav.settings',
      icon: 'user_settings',
      permissions: [],
      shared: false,
    },
    show: computed(() => sidebarItemsPrefs.value.settings!),
  },
  {
    id: 'documents',
    parent_id: '',
    label: 'components.sidebar.nav.documents',
    route: '/dashboard/docs',
    icon: 'files',
    data: {
      id: 'documents',
      role: -1,
      name: 'components.sidebar.nav.documents',
      icon: 'files',
      permissions: [],
      shared: false,
    },
    show: computed(() => sidebarItemsPrefs.value.documents!),
  },
  {
    id: 'importations',
    parent_id: '',
    label: 'components.sidebar.nav.imports',
    route: '/dashboard/import',
    icon: 'import',
    data: {
      id: 'import',
      role: -1,
      name: 'components.sidebar.nav.imports',
      icon: 'import',
      permissions: [],
      shared: false,
    },
    show: computed(() => sidebarItemsPrefs.value.importation!),
  },
  {
    id: 'new-page',
    parent_id: '',
    label: 'components.sidebar.nav.newPage',
    route: '/dashboard/docs/new',
    icon: 'add_file',
    data: {
      id: 'new-page',
      role: -1,
      name: 'components.sidebar.nav.newPage',
      icon: 'add_file',
      permissions: [],
      shared: false,
    },
    show: computed(() => sidebarItemsPrefs.value.newPage!),
  },
];
