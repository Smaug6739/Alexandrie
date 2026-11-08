import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { compareManualOrder, moveDocument } from '../app/helpers/manualOrder';
import { TreeBuilder } from '../app/helpers/TreeBuilder';

describe('manual document ordering', () => {
  it('moves documents in both directions, before and after a target', () => {
    const ids = ['intro', 'design', 'implementation'];
    assert.deepEqual(moveDocument(ids, 'implementation', 'intro', false), ['implementation', 'intro', 'design']);
    assert.deepEqual(moveDocument(ids, 'intro', 'implementation', true), ['design', 'implementation', 'intro']);
    assert.deepEqual(moveDocument(ids, 'intro', 'design', false), ids);
    assert.deepEqual(moveDocument(ids, 'implementation', 'design', true), ids);
    assert.deepEqual(ids, ['intro', 'design', 'implementation']);
  });
  it('ignores missing targets, missing sources, and self drops', () => {
    for (const [source, target] of [
      ['missing', 'a'],
      ['a', 'missing'],
      ['a', 'a'],
    ]) {
      assert.deepEqual(moveDocument(['a', 'b'], source!, target!, false), ['a', 'b']);
    }
  });
  it('puts new documents after the persisted order and tolerates absent metadata', () => {
    const saved = JSON.parse(JSON.stringify(['b', 'deleted', 'a']));
    assert.deepEqual(
      ['a', 'new', 'b'].sort((a, b) => compareManualOrder(a, b, saved)),
      ['b', 'a', 'new'],
    );
    assert.equal(compareManualOrder('a', 'b', undefined), 0);
    assert.equal(compareManualOrder('a', 'b', {}), 0);
  });
  it('uses the same sequence for sidebar children and previous/next navigation', () => {
    const nodes = [
      { id: 'category', role: 2, parent_id: undefined },
      { id: 'a', role: 3, parent_id: 'category' },
      { id: 'resource', role: 4, parent_id: 'category' },
      { id: 'b', role: 3, parent_id: 'category' },
      { id: 'c', role: 3, parent_id: 'category' },
    ];
    let order = ['c', 'a', 'b'];
    const builder = new TreeBuilder(
      {
        size: nodes.length,
        get: id => nodes.find(n => n.id === id),
        getChildrenIds: parent => nodes.filter(n => (n.parent_id ?? null) === (parent ?? null)).map(n => n.id),
      },
      node => ({ id: node.id, parentId: node.parent_id, label: node.id, route: '', data: node }),
      (a, b) => compareManualOrder(a.id, b.id, order),
    );
    const documents = (node?: { role: number }) => node?.role === 3;
    const sidebar = () =>
      builder
        .buildTree()[0]!
        .children!.filter(n => documents(n.data))
        .map(n => n.id);
    assert.deepEqual(sidebar(), order);
    assert.equal(builder.getSibling('a', -1, documents)?.id, 'c');
    assert.equal(builder.getSibling('a', 1, documents)?.id, 'b');
    assert.equal(builder.getSibling('c', -1, documents), undefined);
    assert.equal(builder.getSibling('b', 1, documents), undefined);
    order = ['b', 'c', 'a'];
    assert.deepEqual(sidebar(), order);
    assert.equal(builder.getSibling('c', -1, documents)?.id, 'b');
    assert.equal(builder.getSibling('c', 1, documents)?.id, 'a');
  });
});
