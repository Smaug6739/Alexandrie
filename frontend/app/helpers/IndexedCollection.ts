import type { Node } from '~/stores/db_structures';

export class IndexedCollection {
  // Unique storage for nodes, indexed by ID
  private store = new Map<string, Node>();

  // Index
  private byParent = new Map<string, string[]>();
  private byRole = new Map<number, string[]>();
  private sortedArray: Node[] = [];

  // Flag to indicate bulk loading mode (to avoid unnecessary sorting during batch operations)
  private isBulkLoading = false;

  get size(): number {
    return this.store.size;
  }

  get(id: string): Node | undefined {
    return this.store.get(id);
  }

  has(id: string): boolean {
    return this.store.has(id);
  }

  /**
   * Access O(1) to children of a parent
   */
  getChildrenIds(parentId: string | null | undefined): string[] {
    return this.byParent.get(parentId ?? '') ?? [];
  }

  /**
   * Access O(1) to nodes by role
   */
  getIdsByRole(role: number): string[] {
    return this.byRole.get(role) ?? [];
  }

  /**
   * Access O(1) to nodes up to a certain role (inclusive)
   */
  getIdsUpToRole(maxRole: number): string[] {
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
    return this.sortedArray;
  }

  set(id: string, node: Node): void {
    const oldNode = this.store.get(id);

    // If the node structure hasn't changed, we can skip the re-indexing
    if (oldNode && oldNode.parent_id === node.parent_id && oldNode.role === node.role && oldNode.name === node.name && oldNode.order === node.order) {
      this.store.set(id, node);
      // Update the sorted array in place if the node's order or name has changed
      const idx = this.sortedArray.findIndex(n => n.id === id);
      if (idx !== -1) this.sortedArray[idx] = node;
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
  }

  delete(id: string): boolean {
    const node = this.store.get(id);
    if (!node) return false;

    this.removeFromIndexes(id, node);
    this.store.delete(id);

    if (!this.isBulkLoading) this.rebuildSortedArray();
    return true;
  }

  clear(): void {
    this.store.clear();
    this.byParent.clear();
    this.byRole.clear();
    this.sortedArray = [];
  }

  forEach(callback: (node: Node, id: string) => void): void {
    this.store.forEach(callback);
  }

  // Bulk operations to optimize performance when adding/removing multiple nodes
  startBulk() {
    this.isBulkLoading = true;
  }
  endBulk() {
    this.isBulkLoading = false;
    this.rebuildSortedArray();
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
    this.sortedArray = Array.from(this.store.values()).sort((a, b) => (a.order ?? 0) - (b.order ?? 0) || a.name.localeCompare(b.name));
  }
}
