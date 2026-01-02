/**
 * Application constants
 * Centralized configuration options for documents, nodes, and UI settings
 */

// Theme color palette
export const appColors = ['blue', 'red', 'green', 'yellow', 'purple', 'pink', 'teal', 'grey'];

// Document display themes
export const DOCUMENT_THEMES = [
  { label: 'Alexandrie', id: 'alexandrie' },
  { label: 'Latex style', id: 'latex' },
  { label: 'Latex colored', id: 'latex-colored' },
  { label: 'Modern', id: 'modern' },
];

// Document visibility options (1 = Private, 3 = Published)
export const DOCUMENT_ACCESSIBILITIES: ANode[] = [
  { id: 1, label: 'Private' },
  { id: 3, label: 'Published' },
];

// Sharing access levels (0 = View only, 2 = Can edit)
export const DOCUMENT_GENERAL_ACCESS: ANode[] = [
  { id: 0, label: 'Viewer' },
  { id: 2, label: 'Editor' },
];

// Document width presets
export const DOCUMENT_SIZES = [
  { label: 'Small', id: 0 },
  { label: 'Medium', id: 1 },
  { label: 'Large', id: 2 },
];

// Editor font options
export const EDITOR_FONTS = [
  { label: 'JetBrains Mono', id: 'JetBrains Mono' },
  { label: 'monospace', id: 'monospace' },
  { label: 'Poppins', id: 'Poppins' },
  { label: 'Inter', id: 'Inter' },
  { label: 'Arial', id: 'Arial' },
  { label: 'Times New Roman', id: 'Times New Roman' },
];

// Node role options (1 = Workspace, 2 = Category)
export const CATEGORY_ROLES = [
  { id: 1, label: 'Workspace' },
  { id: 2, label: 'Category' },
];

// Permission levels for sharing
export const NODE_PERMISSIONS = [
  { label: 'Viewer', id: 1 },
  { label: 'Editor', id: 2 },
  { label: 'Admin', id: 3 },
];

export const PDF_SCALES = [
  { label: 'Automatic Zoom', id: 'automatic_zoom' },
  { label: 'Actual Size', id: 'actual_size' },
  { label: 'Page fit', id: 'page_fit' },
  { label: 'Page width', id: 'page_width' },
  { label: '50%', id: 0.5 },
  { label: '75%', id: 0.75 },
  { label: '100%', id: 1.0 },
  { label: '125%', id: 1.25 },
  { label: '150%', id: 1.5 },
  { label: '200%', id: 2.0 },
] as Array<{ label: string; id: 'automatic_zoom' | 'actual_size' | 'page_fit' | 'page_width' | number }>;
