import assert from 'node:assert/strict';
import { describe, test } from 'node:test';

import MarkdownIt from 'markdown-it';

import { copyCodePlugin, resolveLanguageLabel } from './code-block';

function render(source: string): string {
  const md = new MarkdownIt({ html: true, linkify: true });
  md.use(copyCodePlugin);
  return md.render(source);
}

describe('resolveLanguageLabel', () => {
  test('maps common aliases to their conventional display name', () => {
    assert.equal(resolveLanguageLabel('js'), 'JavaScript');
    assert.equal(resolveLanguageLabel('javascript'), 'JavaScript');
    assert.equal(resolveLanguageLabel('ts'), 'TypeScript');
    assert.equal(resolveLanguageLabel('py'), 'Python');
    assert.equal(resolveLanguageLabel('sh'), 'Bash');
    assert.equal(resolveLanguageLabel('java'), 'Java');
  });

  test('is case insensitive on the hint', () => {
    assert.equal(resolveLanguageLabel('JS'), 'JavaScript');
    assert.equal(resolveLanguageLabel('Java'), 'Java');
  });

  test('falls back to the hint itself for languages it does not know', () => {
    assert.equal(resolveLanguageLabel('zig'), 'zig');
    assert.equal(resolveLanguageLabel('my-dsl'), 'my-dsl');
  });

  test('ignores anything after the language hint, as highlight.js does', () => {
    // ```js {1,3} highlights lines; the label should still read JavaScript.
    assert.equal(resolveLanguageLabel('js {1,3}'), 'JavaScript');
    assert.equal(resolveLanguageLabel('java title="Example.java"'), 'Java');
  });

  test('returns an empty label when no language was given', () => {
    assert.equal(resolveLanguageLabel(''), '');
    assert.equal(resolveLanguageLabel('   '), '');
  });
});

describe('copyCodePlugin', () => {
  test('labels a fenced block with its language', () => {
    const html = render('```java\nclass A {}\n```');

    assert.match(html, /<span class="code-block-language">Java<\/span>/);
  });

  test('keeps the copy button', () => {
    const html = render('```java\nclass A {}\n```');

    assert.match(html, /class="code-copy-btn"/);
  });

  test('omits the label for a block without a language', () => {
    const html = render('```\nplain text\n```');

    assert.doesNotMatch(html, /code-block-language/);
    assert.match(html, /class="code-copy-btn"/, 'the copy button stays regardless');
  });

  test('omits the label for an indented code block, which has no language', () => {
    const html = render('    indented code\n');

    assert.doesNotMatch(html, /code-block-language/);
  });

  test('escapes the language hint so it cannot inject markup', () => {
    const html = render('```<img src=x onerror=alert(1)>\ncode\n```');

    assert.doesNotMatch(html, /<img/);
    assert.match(html, /&lt;img/);
  });

  test('wraps the block so the label can be positioned against it', () => {
    const html = render('```js\nconst a = 1;\n```');

    assert.match(html, /<div class="code-block-wrapper">/);
    assert.match(html, /<span class="code-block-language">JavaScript<\/span>/);
  });
});
