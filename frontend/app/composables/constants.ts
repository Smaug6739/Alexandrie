export const DOCUMENT_THEMES = [
  { label: 'Alexandrie', id: 'alexandrie' },
  { label: 'Latex style', id: 'latex' },
  { label: 'Latex colored', id: 'latex-colored' },
  { label: 'modern colored', id: 'modern-colored' },
];

export const DOCUMENT_ACCESSIBILITIES: ANode[] = [
  { id: 1, label: 'Private' },
  { id: 3, label: 'Published' },
];
export const DOCUMENT_GENERAL_ACCESS: ANode[] = [
  { id: 0, label: 'Viewer' },
  { id: 2, label: 'Editor' },
];

export const DOCUMENT_SIZES = [
  { label: 'Small', id: 0 },
  { label: 'Medium', id: 1 },
  { label: 'Large', id: 2 },
];

export const EDITOR_FONTS = [
  { label: 'JetBrains Mono', id: 'JetBrains Mono' },
  { label: 'monospace', id: 'monospace' },
  { label: 'Poppins', id: 'Poppins' },
  { label: 'Inter', id: 'Inter' },
  { label: 'Arial', id: 'Arial' },
  { label: 'Times New Roman', id: 'Times New Roman' },
];

export const CATEGORY_ROLES = [
  { id: 1, label: 'Workspace' },
  { id: 2, label: 'Category' },
];

export const NODE_PERMISSIONS = [
  { label: 'Viewer', id: 1 },
  { label: 'Editor', id: 2 },
  { label: 'Admin', id: 3 },
];
