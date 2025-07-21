import type { Category } from '~/stores';

export interface DefaultItem {
  id: string;
  type: 'navigation';
  label: string;
  icon?: string;
  route: string;
  childrens: DefaultItem[];
}
export interface Workspace {
  text: string;
  value: string | null;
  meta?: Category;
}

export const navigationItems: Item<DefaultItem>[] = [
  {
    id: 'manage-categories',
    parent_id: '',
    label: 'Manage categories',
    route: '/dashboard/categories',
    icon: 'categories',
    data: {
      id: 'manage-categories',
      type: 'navigation',
      label: 'Manage categories',
      icon: 'categories',
      route: '/dashboard/categories',
      childrens: [],
    },
    show: ref(true),
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
      label: 'CDN',
      icon: 'cdn',
      route: '/dashboard/cdn',
      childrens: [],
    },
    show: ref(true),
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
      label: 'Settings',
      icon: 'user_settings',
      route: '/dashboard/settings',
      childrens: [],
    },
    show: ref(true),
  },
];
