export interface BaseCommand {
  id: string;
  title: string;
  description: string;
  icon: string;
  path: string;
}

export interface SearchResult extends BaseCommand {
  category: string;
  metadata?: string;
}

export interface QuickAction extends BaseCommand {
  shortcut: string;
}

export interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: string;
  path: string;
  shortcut: string;
}

export const availablePages: SearchResult[] = [
  {
    id: 'home',
    title: 'Home',
    description: 'Main dashboard',
    icon: 'dashboard',
    path: '/dashboard',
    category: 'Navigation',
  },
  {
    id: 'docs',
    title: 'Documents',
    description: 'Manage your documents',
    icon: 'file',
    path: '/dashboard/docs',
    category: 'Management',
  },
  {
    id: 'categories',
    title: 'Categories',
    description: 'Organize your categories',
    icon: 'categories',
    path: '/dashboard/categories',
    category: 'Management',
  },
  {
    id: 'cdn',
    title: 'CDN',
    description: 'Manage your resources',
    icon: 'cdn',
    path: '/dashboard/cdn',
    category: 'Management',
  },
  {
    id: 'import',
    title: 'Import',
    description: 'Import documents',
    icon: 'import',
    path: '/dashboard/import',
    category: 'Actions',
  },
  {
    id: 'settings',
    title: 'Settings',
    description: 'Configure the application',
    icon: 'settings',
    path: '/dashboard/settings',
    category: 'Configuration',
  },
];

export const quickActions: QuickAction[] = [
  {
    id: 'new-doc',
    title: 'New document',
    description: 'Create a new document',
    icon: 'add_file',
    shortcut: 'Ctrl+N',
    path: '/dashboard/docs/new',
  },
  {
    id: 'new-category',
    title: 'New category',
    description: 'Create a new category',
    icon: 'add_folder',
    shortcut: 'Ctrl+Shift+N',
    path: '/dashboard/categories',
  },
  {
    id: 'search-docs',
    title: 'Search in docs',
    description: 'Search in your documents',
    icon: 'search',
    shortcut: 'Ctrl+q',
    path: '/dashboard/docs',
  },
  {
    id: 'upload-file',
    title: 'Upload file',
    description: 'Add a resource to CDN',
    icon: 'import',
    shortcut: 'Ctrl+U',
    path: '/dashboard/cdn',
  },
];
