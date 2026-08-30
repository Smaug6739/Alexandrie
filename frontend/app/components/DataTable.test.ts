import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { describe, test } from 'node:test';

const component = readFileSync(new URL('./DataTable.vue', import.meta.url), 'utf8');
const pageSizeSelect = component.match(/<select[\s\S]*?<\/select>/)?.[0];

describe('DataTable page size', () => {
  test('displays the persisted page size in the select', () => {
    assert.ok(pageSizeSelect, 'expected the page-size select to exist');
    assert.match(pageSizeSelect, /:value="itemsPerPage"/);
  });

  test('keeps the existing pagination update, default, and preference semantics', () => {
    assert.ok(pageSizeSelect, 'expected the page-size select to exist');
    assert.match(pageSizeSelect, /@change="[^"]*paginator\.setMaxPerPage\(parseInt\([\s\S]*?\) \|\| 10\)"/);
    assert.match(component, /const itemsPerPage = usePreferencesStore\(\)\.get\('datatableItemsCount'\);/);
    assert.match(component, /new Paginator<Field>\([\s\S]*?itemsPerPage\.value \|\| 10,/);
  });
});
