/**
 * Resource/File utilities
 * Helpers for working with uploaded files and CDN resources
 */
import type { Node } from '~/stores';

/** Convert bytes to human-readable size (e.g., "1.5 MB") */
const readableFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

/** Check if a filetype MIME string represents an image */
const isImageFile = (filetype: string): boolean => filetype.startsWith('image/');

/** Check if a filetype MIME string represents a video */
const isVideoFile = (filetype: string): boolean => filetype.startsWith('video/');

/** Check if a filetype MIME string represents an audio */
const isAudioFile = (filetype: string): boolean => filetype.startsWith('audio/');

/** Check if a filetype MIME string represents a PDF */
const isPdfFile = (filetype: string): boolean => filetype.startsWith('application/pdf');

/** Get the CDN preview URL for a resource node */
const resolvePreviewUrl = (node: Node): string => {
  const { resourceURL } = useApi();
  if (isImageFile((node.metadata?.filetype as string) || '')) {
    return resourceURL(node);
  }
  if (isPdfFile((node.metadata?.filetype as string) || '')) {
    return '/placeholder/pdf.webp';
  }
  return '/placeholder/file.webp';
};

/** Resolve the appropriate icon for a file based on its role and properties */
const resolveFileIcon = (mimeType: string) => {
  if (mimeType.startsWith('image/')) return 'image';
  if (mimeType.startsWith('video/')) return 'video';
  if (mimeType.startsWith('audio/')) return 'sidebar/music';
  if (mimeType.includes('pdf')) return 'sidebar/pdf';
  return 'sidebar/attachment';
};

/** Get human-readable type name for a file based on its MIME type */
const resolveFileType = (mimeType: string) => {
  if (mimeType.startsWith('image/')) return 'Image';
  if (mimeType.startsWith('video/')) return 'Video';
  if (mimeType.startsWith('audio/')) return 'Audio';
  if (mimeType.includes('pdf')) return 'PDF';
  if (mimeType.includes('zip') || mimeType.includes('archive')) return 'Archive';
  return 'File';
};

export { readableFileSize, resolvePreviewUrl, isImageFile, resolveFileIcon, resolveFileType, isPdfFile, isVideoFile, isAudioFile };
