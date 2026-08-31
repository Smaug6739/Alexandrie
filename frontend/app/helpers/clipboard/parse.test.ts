import assert from 'node:assert/strict';
import { describe, test } from 'node:test';

import { extractRemoteImages, classifyPayload } from './parse';

describe('extractRemoteImages', () => {
  test('collects absolute http(s) sources', () => {
    const html = '<p>text</p><img src="https://example.com/a.png"><img src="http://example.com/b.jpg">';

    assert.deepEqual(extractRemoteImages(html), ['https://example.com/a.png', 'http://example.com/b.jpg']);
  });

  test('ignores data: and blob: sources, which need no download', () => {
    const html = '<img src="data:image/png;base64,iVBOR"><img src="blob:http://x/y"><img src="https://example.com/a.png">';

    assert.deepEqual(extractRemoteImages(html), ['https://example.com/a.png']);
  });

  test('ignores javascript: and other schemes', () => {
    const html = '<img src="javascript:alert(1)"><img src="file:///etc/passwd"><img src="ftp://example.com/a.png">';

    assert.deepEqual(extractRemoteImages(html), []);
  });

  test('ignores relative sources, which cannot be resolved outside their origin', () => {
    const html = '<img src="/images/a.png"><img src="../b.png">';

    assert.deepEqual(extractRemoteImages(html), []);
  });

  test('deduplicates repeated sources so one upload covers every occurrence', () => {
    const html = '<img src="https://example.com/a.png"><img src="https://example.com/a.png">';

    assert.deepEqual(extractRemoteImages(html), ['https://example.com/a.png']);
  });

  test('handles single quotes and extra attributes', () => {
    const html = `<img loading="lazy" src='https://example.com/a.png' width="20" alt="x">`;

    assert.deepEqual(extractRemoteImages(html), ['https://example.com/a.png']);
  });

  test('decodes HTML entities in the URL, as real clipboard HTML contains them', () => {
    // Wikipedia's clipboard HTML carries query strings escaped this way.
    const html = '<img src="https://example.com/a.png?utm_source=x&amp;utm_campaign=y">';

    assert.deepEqual(extractRemoteImages(html), ['https://example.com/a.png?utm_source=x&utm_campaign=y']);
  });

  test('returns nothing for html without images', () => {
    assert.deepEqual(extractRemoteImages('<p>just text</p>'), []);
    assert.deepEqual(extractRemoteImages(''), []);
  });
});

describe('classifyPayload', () => {
  test('files take precedence: a screenshot needs no HTML handling', () => {
    assert.equal(classifyPayload({ files: 1, html: false, text: false }), 'files');
    assert.equal(classifyPayload({ files: 1, html: true, text: true }), 'files');
  });

  test('html without files is rich content', () => {
    assert.equal(classifyPayload({ files: 0, html: true, text: true }), 'rich');
  });

  test('text alone is plain', () => {
    assert.equal(classifyPayload({ files: 0, html: false, text: true }), 'plain');
  });

  test('nothing usable is empty', () => {
    assert.equal(classifyPayload({ files: 0, html: false, text: false }), 'empty');
  });
});
