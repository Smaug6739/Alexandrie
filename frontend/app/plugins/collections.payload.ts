/**
 * Payload reducers/revivers for the non-POJO structures kept in Pinia state.
 *
 * The nodes store holds class instances (`IndexedCollection`, and `Collection`, a
 * `Map` subclass) in its state. When SSR is enabled Nuxt serialises the Pinia state
 * into the payload with `devalue`, which throws `Cannot stringify arbitrary non-POJOs`
 * on class instances. Rather than flattening the data model into plain objects, we
 * teach `devalue` how to (de)serialise these types: on the server each instance is
 * reduced to a plain array, and on the client it is rebuilt into the original class.
 */
import { IndexedCollection } from '~/helpers/IndexedCollection';
import { Collection } from '~/stores/collection';
import type { Node } from '~/stores/db_structures';

export default definePayloadPlugin(() => {
  // IndexedCollection -> array of nodes (indexes are rebuilt on revive).
  definePayloadReducer('IndexedCollection', (data: unknown) => {
    if (!(data instanceof IndexedCollection)) return;
    return (toRaw(data) as IndexedCollection).toSortedArray().map(n => toRaw(n));
  });
  definePayloadReviver('IndexedCollection', (nodes: Node[]) => {
    const collection = new IndexedCollection();
    collection.startBulk();
    for (const node of nodes) collection.set(node.id, node);
    collection.endBulk();
    return collection;
  });

  // Collection (Map subclass) -> array of [key, value] entries.
  definePayloadReducer('NodeCollection', (data: unknown) => {
    if (!(data instanceof Collection)) return;
    return [...(toRaw(data) as Collection<unknown, unknown>).entries()];
  });
  definePayloadReviver('NodeCollection', (entries: [unknown, unknown][]) => {
    const collection = new Collection();
    for (const [key, value] of entries) collection.set(key, value);
    return collection;
  });
});
