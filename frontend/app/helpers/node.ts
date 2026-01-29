/**
 * Node utilities - centralized helpers for working with nodes (documents, categories, workspaces, resources)
 * Roles: 1 = Workspace, 2 = Category, 3 = Document, 4 = Resource
 */
import type { DB_Node, Node } from '~/stores';

/** Resolve the appropriate icon for a node based on its role and properties */
export const resolveIcon = (item: Node | DB_Node): string => {
  if (item.icon) return item.icon;
  if (item.role === 1) return 'workspace';
  if (item.role === 2 && 'shared' in item) return item.shared ? 'shared_folder' : 'folder';
  if (item.role === 3) return item.accessibility == 1 ? 'sidebar/file' : item.accessibility == 2 ? 'draft' : 'shared_doc';
  if (item.role === 4) return item.metadata?.filetype == 'application/pdf' ? 'pdf' : 'sidebar/image';
  return 'sidebar/file';
};

/** Get the dashboard route for a node */
export const resolveNodeLink = (node: Node): string => {
  if (node.role === 1 || node.role === 2) return `/dashboard/categories/${node.id}`;
  if (node.role === 3) return `/dashboard/docs/${node.id}`;
  if (node.role === 4) return `/dashboard/cdn/${node.id}/preview`;
  return '/dashboard';
};

export const getRoleName = (role?: number): string => {
  if (role === undefined) return 'Node';
  const roles: Record<number, string> = { 1: 'Workspace', 2: 'Category', 3: 'Document', 4: 'Resource' };
  return roles[role] || 'Unknown';
};

/** Get human-readable type name for a node */
export const resolveNodeType = (node: Node): string => {
  const types: Record<number, string> = { 1: 'Workspace', 2: 'Category', 3: 'Document', 4: 'Resource' };
  return types[node.role] || '';
};

/* Generate markdown file with metadata from a node */
export const generateMarkdownWithMetadata = (node: Node): string => {
  const metadataLines = ['---', `title: "${node.name}"`];

  if (node.description) metadataLines.push(`description: "${node.description}"`);
  if (node.tags && node.tags.length > 0) metadataLines.push(`tags: ${node.tags}`);
  metadataLines.push('---', '', '');
  return metadataLines.join('\n') + (node.content || '');
};
