import localforage from 'localforage';
import type { Node } from '~/stores/db_structures';

export interface OfflineDelta {
  id: string;
  action: 'POST' | 'PUT' | 'DELETE';
  timestamp: number;
  node?: Partial<Node>;
  order: number;
}

let counter = 0;

const deltaStorage = localforage.createInstance({
  name: 'alexandrie-offline',
  storeName: 'deltas',
});

export const LocalDbService = {
  /**
   * Save a creation delta (POST) for a node
   */
  async saveCreateDelta(node: Partial<Node>): Promise<Node> {
    const id = node.id || self.crypto.randomUUID();
    const localNode = {
      ...JSON.parse(JSON.stringify(node)),
      id: id,
      created_timestamp: node.created_timestamp || Date.now(),
      updated_timestamp: node.updated_timestamp || Date.now(),
      partial: false,
      synced: false,
      shared: false,
      permissions: [],
    };
    const delta: OfflineDelta = {
      id: id, // ID can be provided for the "pending" node (node that has not been created yet but has content from the editor)
      action: 'POST',
      timestamp: node.created_timestamp || Date.now(),
      node: JSON.parse(JSON.stringify(localNode)),
      order: counter++,
    };
    await deltaStorage.setItem(id, delta);
    return localNode as Node;
  },

  /**
   * Save an update delta (PUT) for a node
   */
  async saveUpdateDelta(node: Node): Promise<void> {
    const currentDelta = await deltaStorage.getItem<OfflineDelta>(node.id);
    if (currentDelta) {
      currentDelta.node = JSON.parse(JSON.stringify(node));
      node.updated_timestamp = Date.now();
      await deltaStorage.setItem(node.id, currentDelta);
      return;
    }
    const delta: OfflineDelta = {
      id: node.id,
      action: 'PUT',
      timestamp: node.updated_timestamp || Date.now(),
      node: JSON.parse(JSON.stringify(node)),
      order: counter++,
    };
    await deltaStorage.setItem(node.id, delta);
  },

  /**
   * Save a deletion delta (DELETE) for a node
   */
  async saveDeleteDelta(id: string): Promise<void> {
    const delta: OfflineDelta = {
      id,
      action: 'DELETE',
      timestamp: Date.now(),
      order: counter++,
    };
    await deltaStorage.setItem(id, delta);
  },

  /**
   * Get all deltas stored in the local database, sorted by order of action (oldest first).
   */

  async getDeltas(): Promise<OfflineDelta[]> {
    const deltas: OfflineDelta[] = [];
    await deltaStorage.iterate((value: OfflineDelta) => {
      deltas.push(value);
    });
    return deltas.sort((a, b) => a.order - b.order);
  },

  async removeDelta(id: string): Promise<void> {
    await deltaStorage.removeItem(id);
  },

  async clearDeltas(): Promise<void> {
    await deltaStorage.clear();
    counter = 0;
  },
};
