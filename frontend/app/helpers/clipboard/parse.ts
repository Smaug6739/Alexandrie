/**
 * Clipboard analysis: turn a DataTransfer into a normalized description of what was
 * pasted or dropped, without touching the network or any store. The import step
 * (./import) decides what to do with it.
 */

export type ClipboardKind = 'files' | 'rich' | 'plain' | 'empty';

export interface ClipboardPayload {
  kind: ClipboardKind;
  /** Real file entries: screenshots, copied image files, dropped files. */
  files: File[];
  /** text/html, when the source offered formatting. */
  html?: string;
  /** text/plain, the fallback every source provides. */
  text?: string;
  /** Absolute image URLs found in the HTML, which have to be fetched separately. */
  remoteImages: string[];
}

/**
 * Files win over HTML: a screenshot or a copied image arrives as a file entry and
 * needs no HTML handling, while the accompanying HTML would only duplicate it.
 */
export function classifyPayload({ files, html, text }: { files: number; html: boolean; text: boolean }): ClipboardKind {
  if (files > 0) return 'files';
  if (html) return 'rich';
  if (text) return 'plain';
  return 'empty';
}

/**
 * Collect the image sources worth downloading. Relative paths are skipped because
 * they cannot be resolved outside their original origin, and data:/blob: sources
 * are already self-contained. Restricting to http(s) also keeps the fetch step from
 * being pointed at other schemes.
 */
export function extractRemoteImages(html: string): string[] {
  if (!html) return [];

  const urls = new Set<string>();

  for (const match of html.matchAll(/<img\b[^>]*?\bsrc\s*=\s*("([^"]*)"|'([^']*)')/gi)) {
    const raw = (match[2] ?? match[3] ?? '').trim();
    if (!raw) continue;

    // Clipboard HTML escapes query separators, so &amp; has to become & before use.
    const url = decodeEntities(raw);
    if (/^https?:\/\//i.test(url)) urls.add(url);
  }

  return [...urls];
}

function decodeEntities(value: string): string {
  return value
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#0?39;|&apos;/gi, "'");
}

/** Read a paste or drop event's data into a payload. */
export function parseClipboard(data: DataTransfer | null): ClipboardPayload {
  if (!data) return { kind: 'empty', files: [], remoteImages: [] };

  const files = [...(data.files ?? [])];
  const html = data.getData('text/html') || undefined;
  const text = data.getData('text/plain') || undefined;

  return {
    kind: classifyPayload({ files: files.length, html: !!html, text: !!text }),
    files,
    html,
    text,
    remoteImages: html ? extractRemoteImages(html) : [],
  };
}
