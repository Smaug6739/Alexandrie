export interface DefaultItem {
  id: string;
  type: 'default';
  label: string;
  icon?: string;
  route: string;
  childrens: DefaultItem[];
}
export interface Workspace {
  text: string;
  value: string | null;
}

export const navigationItems: DefaultItem[] = [
  {
    id: 'manage-categories',
    type: 'default',
    label: 'Manage categories',
    icon: 'categories',
    route: '/dashboard/categories',
    childrens: [],
  },
  {
    id: 'cdn',
    type: 'default',
    label: 'CDN',
    icon: 'cdn',
    route: '/dashboard/cdn',
    childrens: [],
  },

  {
    id: 'settings',
    type: 'default',
    label: 'Settings',
    icon: 'user_settings',
    route: '/dashboard/settings',
    childrens: [],
  },
];
