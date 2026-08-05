import assert from 'node:assert/strict';
import { describe, test } from 'node:test';

import { assignParent } from './resources-parent';

describe('assignParent', () => {
  test('returns resources assigned to the selected parent without mutating the originals', () => {
    const resources = [
      { id: 'resource-1', parent_id: 'old-parent' },
      { id: 'resource-2' },
    ];

    const updated = assignParent(resources, 'document-1');

    assert.deepEqual(updated, [
      { id: 'resource-1', parent_id: 'document-1' },
      { id: 'resource-2', parent_id: 'document-1' },
    ]);
    assert.deepEqual(resources, [
      { id: 'resource-1', parent_id: 'old-parent' },
      { id: 'resource-2' },
    ]);
  });
});
