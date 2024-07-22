export interface DefaultItem {
  id: string;
  type: 'default';
  title: string;
  icon?: string;
  route: string;
  childrens: DefaultItem[];
}

export const navigationItems: DefaultItem[] = [
  {
    id: 'manage-categories',
    type: 'default',
    title: 'Manage categories',
    icon: 'categories',
    route: '/dashboard/categories',
    childrens: [],
  },
  {
    id: 'cdn',
    type: 'default',
    title: 'CDN',
    icon: 'cdn',
    route: '/dashboard/cdn',
    childrens: [],
  },

  {
    id: 'settings',
    type: 'default',
    title: 'Settings',
    icon: 'settings',
    route: '/dashboard/settings',
    childrens: [],
  },
];
