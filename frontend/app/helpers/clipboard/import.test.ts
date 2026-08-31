import assert from 'node:assert/strict';
import { describe, test } from 'node:test';

import { importClipboard, type ImportContext } from './import';

/** Context whose uploader records calls and returns a predictable CDN URL. */
function stubContext(overrides: Partial<ImportContext> = {}): ImportContext & { uploads: string[] } {
  const uploads: string[] = [];

  const ctx = {
    uploads,
    maxImages: 20,
    upload: async (file: File) => {
      uploads.push(file.name);
      return `https://cdn.test/${file.name}`;
    },
    fetchImage: async (url: string) => new File([new Uint8Array([1, 2, 3])], url.split('/').pop() || 'image.png', { type: 'image/png' }),
    htmlToMarkdown: (html: string) => html.replace(/<[^>]+>/g, '').trim(),
    ...overrides,
  } as ImportContext & { uploads: string[] };

  return ctx;
}

describe('importClipboard', () => {
  test('uploads pasted files and references them as markdown images', async () => {
    const ctx = stubContext();
    const file = new File([new Uint8Array([1])], 'shot.png', { type: 'image/png' });

    const result = await importClipboard({ kind: 'files', files: [file], remoteImages: [] }, ctx);

    assert.deepEqual(ctx.uploads, ['shot.png']);
    assert.equal(result.markdown, '![shot.png](https://cdn.test/shot.png)');
    assert.equal(result.uploaded, 1);
    assert.equal(result.failed, 0);
  });

  test('links non-image files instead of embedding them', async () => {
    const ctx = stubContext();
    const file = new File([new Uint8Array([1])], 'notes.pdf', { type: 'application/pdf' });

    const result = await importClipboard({ kind: 'files', files: [file], remoteImages: [] }, ctx);

    assert.equal(result.markdown, '[notes.pdf](https://cdn.test/notes.pdf)');
  });

  test('converts rich html and rewrites its image urls to the uploaded copies', async () => {
    const ctx = stubContext({
      htmlToMarkdown: () => '# Title\n\n![](https://example.com/a.png)\n\ntext',
    });

    const result = await importClipboard(
      { kind: 'rich', files: [], html: '<h1>Title</h1><img src="https://example.com/a.png">', remoteImages: ['https://example.com/a.png'] },
      ctx,
    );

    assert.equal(result.markdown, '# Title\n\n![](https://cdn.test/a.png)\n\ntext');
    assert.equal(result.uploaded, 1);
    assert.equal(result.failed, 0);
  });

  test('keeps the original url when the image cannot be fetched', async () => {
    const ctx = stubContext({
      fetchImage: async () => {
        throw new Error('CORS');
      },
      htmlToMarkdown: () => '![](https://example.com/a.png)',
    });

    const result = await importClipboard({ kind: 'rich', files: [], html: '<img src="https://example.com/a.png">', remoteImages: ['https://example.com/a.png'] }, ctx);

    assert.equal(result.markdown, '![](https://example.com/a.png)', 'the image must stay reachable via its origin');
    assert.equal(result.uploaded, 0);
    assert.equal(result.failed, 1);
  });

  test('reports partial success so the caller can tell the user', async () => {
    let call = 0;
    const ctx = stubContext({
      fetchImage: async (url: string) => {
        if (++call === 2) throw new Error('CORS');
        return new File([new Uint8Array([1])], url.split('/').pop()!, { type: 'image/png' });
      },
      htmlToMarkdown: () => '![](https://e.com/a.png) ![](https://e.com/b.png) ![](https://e.com/c.png)',
    });

    const result = await importClipboard(
      { kind: 'rich', files: [], html: 'x', remoteImages: ['https://e.com/a.png', 'https://e.com/b.png', 'https://e.com/c.png'] },
      ctx,
    );

    assert.equal(result.uploaded, 2);
    assert.equal(result.failed, 1);
    assert.match(result.markdown, /cdn\.test\/a\.png/);
    assert.match(result.markdown, /e\.com\/b\.png/, 'the failed one keeps its original url');
    assert.match(result.markdown, /cdn\.test\/c\.png/);
  });

  test('rewrites every occurrence of a repeated image', async () => {
    const ctx = stubContext({
      htmlToMarkdown: () => '![](https://e.com/a.png)\n![](https://e.com/a.png)',
    });

    const result = await importClipboard({ kind: 'rich', files: [], html: 'x', remoteImages: ['https://e.com/a.png'] }, ctx);

    assert.equal(result.markdown, '![](https://cdn.test/a.png)\n![](https://cdn.test/a.png)');
    assert.equal(ctx.uploads.length, 1, 'one upload serves both references');
  });

  test('stops after maxImages, so pasting a whole article cannot flood the CDN', async () => {
    const many = Array.from({ length: 8 }, (_, i) => `https://e.com/${i}.png`);
    const ctx = stubContext({ maxImages: 3, htmlToMarkdown: () => many.map(u => `![](${u})`).join('\n') });

    const result = await importClipboard({ kind: 'rich', files: [], html: 'x', remoteImages: many }, ctx);

    assert.equal(ctx.uploads.length, 3);
    assert.equal(result.uploaded, 3);
    assert.equal(result.skipped, 5);
    assert.match(result.markdown, /e\.com\/7\.png/, 'skipped images keep their original url');
  });

  test('passes plain text through untouched', async () => {
    const ctx = stubContext();

    const result = await importClipboard({ kind: 'plain', files: [], text: 'just text', remoteImages: [] }, ctx);

    assert.equal(result.markdown, 'just text');
    assert.deepEqual(ctx.uploads, []);
  });

  test('prefers plain text when the html carries no formatting worth keeping', async () => {
    const ctx = stubContext({ htmlToMarkdown: () => 'hello' });

    const result = await importClipboard({ kind: 'rich', files: [], html: '<span>hello</span>', text: 'hello', remoteImages: [] }, ctx);

    assert.equal(result.markdown, 'hello');
  });

  test('returns nothing for an empty payload', async () => {
    const ctx = stubContext();

    const result = await importClipboard({ kind: 'empty', files: [], remoteImages: [] }, ctx);

    assert.equal(result.markdown, '');
    assert.equal(result.uploaded, 0);
  });

  test('a failing upload does not abort the remaining ones', async () => {
    let call = 0;
    const ctx = stubContext({
      upload: async (file: File) => {
        if (++call === 1) throw new Error('upload rejected');
        return `https://cdn.test/${file.name}`;
      },
    });
    const files = [new File([new Uint8Array([1])], 'a.png', { type: 'image/png' }), new File([new Uint8Array([1])], 'b.png', { type: 'image/png' })];

    const result = await importClipboard({ kind: 'files', files, remoteImages: [] }, ctx);

    assert.equal(result.uploaded, 1);
    assert.equal(result.failed, 1);
    assert.match(result.markdown, /cdn\.test\/b\.png/);
  });
});
