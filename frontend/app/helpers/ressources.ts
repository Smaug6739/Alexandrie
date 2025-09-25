import type { Node } from '~/stores';

const readableFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

const isImageFile = (filetype: string): boolean => {
  return filetype.startsWith('image/');
};

const resolvePreviewUrl = (node: Node): string => {
  if (isImageFile((node.metadata?.filetype as string) || '')) return `${CDN}/${node.user_id}/${node.metadata?.transformed_path}`;
  return '/file_placeholder.png';
};

export { readableFileSize, resolvePreviewUrl, isImageFile };
