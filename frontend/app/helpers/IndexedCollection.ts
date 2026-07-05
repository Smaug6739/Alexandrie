import type { Node } from '~/stores/db_structures';

export class IndexedCollection {
  // Unique storage for nodes, indexed by ID
  private store = new Map<string, Node>();

  // Index
  private byParent = new Map<string, string[]>();
  private byRole = new Map<number, string[]>();
  private sortedArray: Node[] = [];

  // Flag to indicate bulk loading mode (to avoid unnecessary sorting during batch operations)
  private isBulkLoading = 0;

  // Internal for reactivity, not exposed to the outside
  private _dependents = shallowRef(null);

  private notify() {
    if (!this.isBulkLoading) {
      triggerRef(this._dependents);
    }
  }

  private track() {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    this._dependents.value;
  }

  get size(): number {
    this.track();
    return this.store.size;
  }

  get(id: string): Node | undefined {
    this.track();
    return this.store.get(id);
  }

  has(id: string): boolean {
    this.track();
    return this.store.has(id);
  }

  /**
   * Iterate over all nodes in the collection
   */
  forEach(callback: (node: Node, id: string) => void): void {
    this.store.forEach(callback);
  }

  /**
   * Access O(1) to children of a parent
   */
  getChildrenIds(parentId: string | null | undefined): string[] {
    this.track();
    return this.byParent.get(parentId ?? '') ?? [];
  }

  /**
   * Access O(1) to nodes by role
   */
  getIdsByRole(role: number): string[] {
    this.track();
    return this.byRole.get(role) ?? [];
  }

  /**
   * Access O(1) to nodes up to a certain role (inclusive)
   */
  getIdsUpToRole(maxRole: number): string[] {
    this.track();
    const ids: string[] = [];
    for (let role = 0; role <= maxRole; role++) {
      ids.push(...this.getIdsByRole(role));
    }
    return ids;
  }

  /**
   * Return pre-sorted array of nodes for iteration
   */
  toSortedArray(): readonly Node[] {
    this.track();
    return this.sortedArray;
  }

  /**
   * Set a node in the collection. Must be called even if the node has been updated by reference, to ensure the indexes are updated and trigger reactivity.
   * @param id The ID of the node
   * @param node The node object
   * @param forceNotify If true, will trigger reactivity even if the node structure hasn't changed
   */
  set(id: string, node: Node, forceNotify = false): void {
    const oldNode = this.store.get(id);

    // If the node structure hasn't changed, we can skip the re-indexing
    if (!hasNodeSignatureChanged(oldNode, node)) {
      this.store.set(id, node);
      // Update the sorted array in place if the node's order or name has changed
      const idx = this.sortedArray.findIndex(n => n.id === id);
      if (idx !== -1) this.sortedArray[idx] = node;
      if (forceNotify) this.notify();
      return;
    }

    // Clean up old indexes if the node already exists
    if (oldNode) {
      this.removeFromIndexes(id, oldNode);
    }

    // Add the new node to the store
    this.store.set(id, node);

    // Build indexes for parent and role
    const pId = node.parent_id ?? '';
    if (!this.byParent.has(pId)) this.byParent.set(pId, []);
    this.byParent.get(pId)!.push(id);

    if (!this.byRole.has(node.role)) this.byRole.set(node.role, []);
    this.byRole.get(node.role)!.push(id);

    if (!this.isBulkLoading) {
      this.rebuildSortedArray();
    }
    if (forceNotify) this.notify();
  }

  delete(id: string): boolean {
    const node = this.store.get(id);
    if (!node) return false;

    this.removeFromIndexes(id, node);
    this.store.delete(id);

    if (!this.isBulkLoading) this.rebuildSortedArray();
    this.notify();
    return true;
  }

  // Used to rebuild the indexes when the hierarchy changes
  rebuildIndexes(): void {
    this.byParent.clear();
    this.byRole.clear();

    for (const [id, node] of this.store.entries()) {
      const pId = node.parent_id ?? '';
      if (!this.byParent.has(pId)) this.byParent.set(pId, []);
      this.byParent.get(pId)!.push(id);

      if (!this.byRole.has(node.role)) this.byRole.set(node.role, []);
      this.byRole.get(node.role)!.push(id);
    }

    if (!this.isBulkLoading) {
      this.rebuildSortedArray();
    }
    this.notify();
  }

  // Clear the entire collection and its indexes
  clear(): void {
    this.store.clear();
    this.byParent.clear();
    this.byRole.clear();
    this.sortedArray = [];
    this.notify();
  }

  // Bulk operations to optimize performance when adding/removing multiple nodes
  startBulk() {
    this.isBulkLoading++;
  }
  endBulk() {
    this.isBulkLoading--;
    this.rebuildSortedArray();
    this.notify();
  }

  // Internal helper to remove a node from the indexes
  private removeFromIndexes(id: string, node: Node) {
    const pId = node.parent_id ?? '';
    const parentArr = this.byParent.get(pId);
    if (parentArr) {
      const idx = parentArr.indexOf(id);
      if (idx !== -1) parentArr.splice(idx, 1);
    }

    const roleArr = this.byRole.get(node.role);
    if (roleArr) {
      const idx = roleArr.indexOf(id);
      if (idx !== -1) roleArr.splice(idx, 1);
    }
  }

  /* 
	Builds the sorted array of nodes based on their order and name.
	*/
  private rebuildSortedArray() {
    this.sortedArray = Array.from(this.store.values()).sort((a, b) => {
      // 1. Sort by role
      if (a.role !== b.role) {
        return b.role - a.role;
      }

      // 2. Sort by order (if roles are identical)
      const orderA = a.order ?? 0;
      const orderB = b.order ?? 0;
      if (orderA !== orderB) {
        return orderA - orderB;
      }

      // 3. Sort by name (if roles and orders are identical)
      return a.name.localeCompare(b.name);
    });
  }
}

function hasNodeSignatureChanged(oldNode: Node | undefined, newNode: Node): boolean {
  if (!oldNode) return true;
  return (
    oldNode.parent_id !== newNode.parent_id ||
    oldNode.role !== newNode.role ||
    oldNode.name !== newNode.name ||
    oldNode.order !== newNode.order ||
    oldNode.icon !== newNode.icon ||
    oldNode.color !== newNode.color ||
    oldNode.accessibility !== newNode.accessibility
  );
}
