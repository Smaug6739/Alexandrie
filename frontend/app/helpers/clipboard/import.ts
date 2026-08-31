import type { ClipboardPayload } from './parse';

/**
 * Clipboard import: turn an analysed payload into markdown, storing any file or
 * remote image as a resource on the way. Every side effect is injected, which keeps
 * this testable without a network or a store.
 */
export interface ImportContext {
  /** Store a file and return the URL to reference it by. */
  upload: (file: File) => Promise<string>;
  /** Fetch a remote image so it can be stored locally. Rejects when blocked. */
  fetchImage: (url: string) => Promise<File>;
  htmlToMarkdown: (html: string) => string;
  /** Upper bound on remote images per paste, so one paste cannot flood the store. */
  maxImages: number;
}

export interface ImportResult {
  markdown: string;
  uploaded: number;
  failed: number;
  skipped: number;
}

function reference(name: string, url: string, isImage: boolean): string {
  return isImage ? `![${name}](${url})` : `[${name}](${url})`;
}

/** Replace every occurrence of a URL inside markdown, matching it literally. */
function replaceAll(markdown: string, from: string, to: string): string {
  return markdown.split(from).join(to);
}

export async function importClipboard(payload: ClipboardPayload, ctx: ImportContext): Promise<ImportResult> {
  let uploaded = 0;
  let failed = 0;
  let skipped = 0;

  if (payload.kind === 'empty') {
    return { markdown: '', uploaded, failed, skipped };
  }

  // Files arrive already local: store each and reference it. Uploads run one at a
  // time so a large paste cannot open a dozen parallel requests.
  if (payload.kind === 'files') {
    const parts: string[] = [];

    for (const file of payload.files) {
      try {
        const url = await ctx.upload(file);
        parts.push(reference(file.name, url, file.type.startsWith('image/')));
        uploaded++;
      } catch {
        // Keep going: one rejected upload should not lose the rest of the paste.
        failed++;
      }
    }

    return { markdown: parts.join('\n'), uploaded, failed, skipped };
  }

  if (payload.kind === 'plain') {
    return { markdown: payload.text ?? '', uploaded, failed, skipped };
  }

  let markdown = ctx.htmlToMarkdown(payload.html ?? '').trim();

  // Some sources wrap plain text in markup that converts to the same text; the
  // plain flavour is then the more faithful paste.
  if (payload.text && markdown === payload.text.trim()) {
    markdown = payload.text;
  }

  for (const [index, url] of payload.remoteImages.entries()) {
    if (index >= ctx.maxImages) {
      // Leave the rest pointing at their origin rather than silently dropping them.
      skipped++;
      continue;
    }

    try {
      const file = await ctx.fetchImage(url);
      markdown = replaceAll(markdown, url, await ctx.upload(file));
      uploaded++;
    } catch {
      // A blocked fetch (CORS) or a rejected upload leaves the original URL in
      // place, so the image still renders from its source.
      failed++;
    }
  }

  return { markdown, uploaded, failed, skipped };
}
