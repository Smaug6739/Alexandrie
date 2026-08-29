import assert from 'node:assert/strict';
import { describe, test } from 'node:test';

import MarkdownIt from 'markdown-it';
import { counterPlugin } from './counters';

const md = new MarkdownIt();
md.use(counterPlugin);

function renderInline(str: string): string {
  return md.renderInline(str);
}

describe('markdown counters', () => {
  test('increments counters by label', () => {
    assert.equal(renderInline('{{ figure }} {{ figure }} {{ table }}'), '1 2 1');
  });

  test('formats counters as roman numerals and letters', () => {
    assert.equal(renderInline('{{ titleH1(R) }} {{ titleH1(R) }} {{ titleH2(l) }} {{ titleH2(L) }}'), 'I II a B');
  });

  test('does not replace counters inside code', () => {
    assert.equal(renderInline('`{{ figure }}`'), '<code>{{ figure }}</code>');
  });
});
