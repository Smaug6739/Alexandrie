import TurndownService from 'turndown';

/**
 * Clipboard HTML is verbose: browsers copy inline styles, wrapper sections and
 * tracking attributes alongside the content. Turndown handles the structure, and the
 * rules below drop what would otherwise survive as noise.
 */
let service: TurndownService | null = null;

function createService(): TurndownService {
  const turndown = new TurndownService({
    headingStyle: 'atx',
    hr: '---',
    bulletListMarker: '-',
    codeBlockStyle: 'fenced',
    emDelimiter: '*',
  });

  // Neither carries meaning once the content is markdown, and both bring long
  // attribute payloads with them.
  turndown.remove(['style', 'script', 'noscript']);

  // Keep tables: turndown emits them as HTML by default, but the markdown pipeline
  // renders GFM tables, so a simple conversion reads better in the editor.
  turndown.addRule('tableCell', {
    filter: ['th', 'td'],
    replacement: content => ` ${content.trim().replace(/\n+/g, ' ')} |`,
  });
  turndown.addRule('tableRow', {
    filter: 'tr',
    replacement: (content, node) => {
      const row = node as HTMLTableRowElement;
      // Markdown allows exactly one delimiter row, right after the first one. Layout
      // tables (an infobox, say) put a <th> label on every row, so keying off <th>
      // per row would scatter delimiters through the table and break it.
      const rows = row.closest('table')?.querySelectorAll('tr');
      const isFirstRow = !rows || rows.length === 0 || rows.item(0) === row;
      const separator = isFirstRow ? `\n|${' --- |'.repeat(row.cells.length)}` : '';
      return `\n|${content}${separator}`;
    },
  });
  turndown.addRule('table', {
    filter: 'table',
    replacement: content => `\n${content.trim()}\n`,
  });

  // A figure's caption belongs under the image, not inside its alt text.
  turndown.addRule('figure', {
    filter: 'figure',
    replacement: (_content, node) => {
      const img = (node as HTMLElement).querySelector('img');
      const caption = (node as HTMLElement).querySelector('figcaption')?.textContent?.trim();
      if (!img) return caption ? `\n${caption}\n` : '';

      const src = img.getAttribute('src') ?? '';
      const alt = img.getAttribute('alt')?.trim() || caption || '';
      return `\n![${alt}](${src})\n${caption ? `\n*${caption}*\n` : ''}`;
    },
  });

  return turndown;
}

export function htmlToMarkdown(html: string): string {
  service ??= createService();

  return service
    .turndown(html)
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}
