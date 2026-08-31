import { htmlToMarkdown } from '~/helpers/clipboard/html-to-markdown';
import { importClipboard, type ImportResult } from '~/helpers/clipboard/import';
import { parseClipboard } from '~/helpers/clipboard/parse';

/** Remote images per paste. A copied article can carry dozens of thumbnails. */
const MAX_REMOTE_IMAGES = 20;

/**
 * Remote images are fetched in the browser, so a source that does not send CORS
 * headers cannot be stored locally. Aborting a slow one keeps a paste responsive;
 * the image then stays referenced by its original URL.
 */
const FETCH_TIMEOUT_MS = 15_000;

function fileNameFromUrl(url: string, type: string): string {
  const fromPath = decodeURIComponent(new URL(url).pathname.split('/').pop() || '');
  if (fromPath && /\.[a-z0-9]{2,5}$/i.test(fromPath)) return fromPath;

  const extension = type.split('/')[1]?.replace(/[^a-z0-9]/gi, '') || 'png';
  return `pasted-image.${extension}`;
}

/**
 * Accepts whatever a paste or drop carries, stores its files and remote images as
 * resources, and hands back markdown that references the stored copies.
 */
export function useClipboardImport(nodeId?: string) {
  const resourcesStore = useResourcesStore();
  const { resourceURL } = useApi();

  async function upload(file: File): Promise<string> {
    const body = new FormData();
    if (nodeId) body.append('parent_id', nodeId);
    body.append('file', file);

    // The backend enforces the size and mime-type limits from its own config, so a
    // rejected upload surfaces here as a failure rather than being pre-empted.
    return resourceURL(await resourcesStore.post(body));
  }

  async function fetchImage(url: string): Promise<File> {
    const response = await fetch(url, { signal: AbortSignal.timeout(FETCH_TIMEOUT_MS), credentials: 'omit', referrerPolicy: 'no-referrer' });
    if (!response.ok) throw new Error(`Request failed with ${response.status}`);

    const blob = await response.blob();
    if (!blob.type.startsWith('image/')) throw new Error('The response was not an image.');

    return new File([blob], fileNameFromUrl(url, blob.type), { type: blob.type });
  }

  async function importFrom(data: DataTransfer | null): Promise<ImportResult> {
    return importClipboard(parseClipboard(data), { upload, fetchImage, htmlToMarkdown, maxImages: MAX_REMOTE_IMAGES });
  }

  return { importFrom };
}
