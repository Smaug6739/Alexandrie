import assert from 'node:assert/strict';
import { describe, test } from 'node:test';

import { htmlToMarkdown } from './html-to-markdown';

describe('htmlToMarkdown', () => {
  test('converts headings, emphasis and links', () => {
    const md = htmlToMarkdown('<h2>Title</h2><p>Some <strong>bold</strong> and <em>italic</em> and a <a href="https://example.com">link</a>.</p>');

    assert.match(md, /^## Title/m);
    assert.match(md, /\*\*bold\*\*/);
    assert.match(md, /\*italic\*/);
    assert.match(md, /\[link\]\(https:\/\/example\.com\)/);
  });

  test('converts nested lists', () => {
    const md = htmlToMarkdown('<ul><li>one<ul><li>nested</li></ul></li><li>two</li></ul>');

    // turndown pads the marker; both `- x` and `-   x` are valid markdown.
    assert.match(md, /^-\s+one/m);
    assert.match(md, /^\s+-\s+nested/m);
    assert.match(md, /^-\s+two/m);
  });

  test('emits a single delimiter row for a table', () => {
    const html = '<table><tr><th>A</th><th>B</th></tr><tr><td>1</td><td>2</td></tr><tr><td>3</td><td>4</td></tr></table>';

    const md = htmlToMarkdown(html);
    const delimiters = md.split('\n').filter(line => /^\|(\s*---\s*\|)+$/.test(line.trim()));

    assert.equal(delimiters.length, 1, `expected exactly one delimiter row, got:\n${md}`);
  });

  test('does not scatter delimiter rows through a layout table that has a th on every row', () => {
    // Shape of a Wikipedia infobox: a header cell per row, not a header row.
    const html = '<table><tr><th>Family</th><td>Modeling</td></tr><tr><th>Website</th><td>uml.org</td></tr><tr><th>Year</th><td>1997</td></tr></table>';

    const md = htmlToMarkdown(html);
    const delimiters = md.split('\n').filter(line => /^\|(\s*---\s*\|)+$/.test(line.trim()));

    assert.equal(delimiters.length, 1, `a delimiter after every row is invalid markdown, got:\n${md}`);
    assert.match(md, /Family/);
    assert.match(md, /Website/);
    assert.match(md, /1997/);
  });

  test('keeps image sources so they can be rewritten after upload', () => {
    const md = htmlToMarkdown('<p><img src="https://example.com/a.png" alt="Alt text"></p>');

    assert.match(md, /!\[Alt text\]\(https:\/\/example\.com\/a\.png\)/);
  });

  test('puts a figure caption below the image rather than inside its alt text', () => {
    const md = htmlToMarkdown('<figure><img src="https://example.com/a.png"><figcaption>A caption</figcaption></figure>');

    assert.match(md, /!\[A caption\]\(https:\/\/example\.com\/a\.png\)/);
    assert.match(md, /\*A caption\*/);
  });

  test('drops style and script content that browsers copy along', () => {
    const md = htmlToMarkdown('<style>.a{color:red}</style><p>text</p><script>alert(1)</script>');

    assert.equal(md, 'text');
  });

  test('strips the inline styles and wrappers that clipboard html carries', () => {
    const html = '<section style="color: rgb(32,33,34); font-family: sans-serif"><span style="font-weight:400"><p>Just text</p></span></section>';

    assert.equal(htmlToMarkdown(html), 'Just text');
  });

  test('collapses runs of blank lines', () => {
    const md = htmlToMarkdown('<p>one</p><div></div><div></div><p>two</p>');

    assert.doesNotMatch(md, /\n{3,}/);
  });

  test('converts code and preformatted blocks', () => {
    const md = htmlToMarkdown('<p>use <code>npm</code></p><pre><code>line one\nline two</code></pre>');

    assert.match(md, /`npm`/);
    assert.match(md, /```/);
    assert.match(md, /line one/);
  });

  test('returns an empty string for empty input', () => {
    assert.equal(htmlToMarkdown(''), '');
  });
});
