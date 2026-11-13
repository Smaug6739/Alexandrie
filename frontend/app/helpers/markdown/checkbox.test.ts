import assert from 'node:assert/strict';
import { describe, test } from 'node:test';

import MarkdownIt from 'markdown-it';
import { markdownItCheckbox, checkboxLine } from './checkbox';

const md = new MarkdownIt();
md.use(markdownItCheckbox);

describe('markdown checkboxes', () => {
  test('finds the source line of each rendered checkbox', () => {
    const markdown = [
      '```',
      '- [ ] example in a code block',
      '```',
      '1. [ ] Back up the database',
      '> - [ ] Quoted',
      '- [ ] Milk',
    ].join('\n');

    assert.deepEqual([0, 1, 2, 3].map(i => checkboxLine(md, markdown, i)), [3, 4, 5, undefined]);
  });
});
