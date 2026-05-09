/**
 * Node utilities - centralized helpers for working with nodes (documents, categories, workspaces, resources)
 * Roles: 1 = Workspace, 2 = Category, 3 = Document, 4 = Resource
 */
import type { DB_Node, Node, NodeSearchResult } from '~/stores';

/** Resolve the appropriate icon for a node based on its role and properties */
export const resolveIcon = (item: Node | DB_Node | NodeSearchResult): string => {
  if (item.icon) return item.icon;
  if (item.role === 1) return 'workspace';
  if (item.role === 2 && 'shared' in item) return item.shared ? 'shared_folder' : 'folder';
  if (item.role === 3) return item.accessibility == 1 ? 'sidebar/file' : item.accessibility == 2 ? 'draft' : 'shared_doc';
  if (item.role === 4) {
    if (item.metadata?.drawio) return 'sidebar/diagram';
    if (item.metadata?.filetype == 'application/pdf') return 'sidebar/pdf';
    if (item.metadata?.filetype?.startsWith('video/')) return 'sidebar/video';
    if (item.metadata?.filetype?.startsWith('audio/')) return 'sidebar/audio';
    if (item.metadata?.filetype?.startsWith('image/')) return 'sidebar/image';
    return 'sidebar/attachment';
  }
  return 'sidebar/attachment';
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

/** Resolve color for a resource-node based on its type */
export const resolveNodeColor = (type: string) =>
  type.includes('image') ? 'green' : type.includes('video') ? 'blue' : type.includes('pdf') ? 'yellow' : 'red';

/* Generate markdown file with metadata from a node */
export const generateMarkdownWithMetadata = (node: Node): string => {
  const metadataLines = ['---', `title: "${node.name}"`];

  if (node.description) metadataLines.push(`description: "${node.description}"`);
  if (node.tags && node.tags.length > 0) metadataLines.push(`tags: ${node.tags}`);
  metadataLines.push('---', '', '');
  return metadataLines.join('\n') + (node.content || '');
};

export const extractMetadataFromMarkdown = (markdown: string): { title: string; description?: string; tags?: string; content_clean: string } => {
  const metadata: { title: string; description?: string; tags?: string } = { title: '' };
  let contentClean = markdown;

  const metadataMatch = markdown.match(/^---\n([\s\S]*?)\n---/);
  if (metadataMatch && metadataMatch[1]) {
    const metadataContent = metadataMatch[1];
    const lines = metadataContent.split('\n');
    for (const line of lines) {
      const [key, ...rest] = line.split(':');
      const value = rest
        .join(':')
        .trim()
        .replace(/^"(.*)"$/, '$1'); // Remove surrounding quotes
      if (key === 'title') metadata.title = value;
      else if (key === 'description') metadata.description = value;
      else if (key === 'tags') metadata.tags = value;
    }
    contentClean = markdown.slice(metadataMatch[0].length).trimStart();
  }

  return { ...metadata, content_clean: contentClean };
};
