import type { Node } from '~/stores';

export const resolveIcon = (item: Node) => {
  if (item.icon) return item.icon;
  if (item.role === 1) return 'workspace';
  if (item.role === 2) return item.shared ? 'shared_folder' : 'folder';
  if (item.role === 3) return item.accessibility == 1 ? 'sidebar/file' : item.accessibility == 2 ? 'draft' : 'shared_doc';
  if (item.role === 4) return item.metadata?.filetype == 'application/pdf' ? 'pdf' : 'sidebar/image';
  return 'sidebar/file';
};
