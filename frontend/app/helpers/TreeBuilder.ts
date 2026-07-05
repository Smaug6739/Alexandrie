export interface TreeItem<T = unknown, ID = string> {
  id: ID;
  parentId?: string | null;
  label: string;
  data: T;
  route: string;
  icon?: string;
  children?: TreeItem<T>[];
  onClick?: () => void;
}
export interface ReadonlyIndexedCollection<T> {
  size: number;
  get(id: string): T | undefined;
  getChildrenIds(parentId: string | null | undefined): string[];
}
export class TreeBuilder<T extends { id: string; parent_id?: string | null; role?: number; order?: number }> {
  private transformCache = new Map<string, TreeItem<T>>();

  constructor(
    private readonly collection: ReadonlyIndexedCollection<T>,
    private readonly transform: (item: T) => Omit<TreeItem<T>, 'children'>,
  ) {}

  /**
   * Transforme un nœud pur en item UI de manière isolée et le met en cache
   */
  public getTransformedItem(id: string): TreeItem<T> | undefined {
    if (this.transformCache.has(id)) {
      return this.transformCache.get(id);
    }

    const rawNode = this.collection.get(id) as T;
    if (!rawNode) return undefined;

    const item: TreeItem<T> = {
      ...this.transform(rawNode),
      children: [],
    };

    this.transformCache.set(id, item);
    return item;
  }

  /**
   * Build the entire descending tree recursively, starting from the roots
   * @param options Optional filters for nodes and roots
   * @returns An array of TreeItem representing the tree structure
   */
  buildTree(options?: { nodeFilter?: (node: T) => boolean; rootFilter?: (node: T) => boolean }): TreeItem<T>[] {
    const rootIds = this.collection.getChildrenIds(null);

    const buildSubtree = (id: string): TreeItem<T> | undefined => {
      const rawNode = this.collection.get(id) as T;
      if (!rawNode) return undefined;

      if (options?.nodeFilter && !options.nodeFilter(rawNode)) {
        return undefined;
      }

      const item = this.getTransformedItem(id);
      if (!item) return undefined;

      const childrenIds = this.collection.getChildrenIds(id);
      if (childrenIds.length > 0) {
        const mappedChildren = childrenIds.map(childId => buildSubtree(childId)).filter((c): c is TreeItem<T> => !!c);

        if (mappedChildren.length > 1) {
          mappedChildren.sort(sortNodes);
        }

        item.children = mappedChildren.length > 0 ? mappedChildren : undefined;
      } else {
        item.children = undefined;
      }
      return item;
    };

    const rootItems = rootIds
      .filter(id => {
        const node = this.collection.get(id) as T;
        if (!node) return false;
        if (options?.rootFilter && !options.rootFilter(node)) return false;
        return true;
      })
      .map(id => buildSubtree(id))
      .filter((item): item is TreeItem<T> => !!item);

    if (rootItems.length > 1) {
      rootItems.sort(sortNodes);
    }

    return rootItems;
  }

  /**
   * Get the next or previous sibling of a node, optionally filtered by a predicate
   */
  getSibling(id: string, direction: number, filter?: (item?: T) => boolean): TreeItem<T> | undefined {
    const currentItem = this.getTransformedItem(id);
    if (!currentItem) return undefined;

    let siblings = this.collection
      .getChildrenIds(currentItem.parentId ?? null)
      .map(id => this.getTransformedItem(id))
      .filter((s): s is TreeItem<T> => !!s);

    if (filter) siblings = siblings.filter(s => filter(s.data));

    const index = siblings.findIndex(s => s.id === id);
    if (index === -1) return undefined;

    return siblings[index + direction] ?? undefined;
  }

  /**
   * Clear the transformation cache, useful when the underlying collection changes
   * to ensure that the tree is rebuilt with the latest data.
   */
  public clearCache() {
    this.transformCache.clear();
  }
}
/** Filter tree recursively, keeping branches with matches */
export function filterTree<T extends TreeItem<unknown>>(items: T[], predicate: (item: T) => boolean): T[] {
  const result: T[] = [];
  for (const item of items) {
    const filteredChildren = item.children ? filterTree(item.children as T[], predicate) : [];
    if (predicate(item) || filteredChildren.length > 0) {
      result.push({ ...item, children: filteredChildren.length ? filteredChildren : undefined } as T);
    }
  }
  return result;
}

export function filterTreeByLabel<T extends TreeItem>(items: T[], query: string): T[] {
  const lowerQuery = query.toLowerCase();
  return filterTree(items, item => item.label.toLowerCase().includes(lowerQuery));
}

/**
 * Flatten a tree structure into a flat array of TreeItems, preserving the order
 * @param items The tree structure to flatten
 * @returns A flat array of TreeItems
 */
export function flattenTree<T>(items: TreeItem<T>[]): TreeItem<T>[] {
  const result: TreeItem<T>[] = [];
  const stack = [...items].reverse();
  while (stack.length > 0) {
    const node = stack.pop()!;
    result.push(node);
    if (node.children) {
      stack.push(...[...node.children].reverse());
    }
  }
  return result;
}

function sortNodes<T extends { id: string; parent_id?: string | null; role?: number; order?: number }>(a: TreeItem<T>, b: TreeItem<T>) {
  if (a.data.role !== b.data.role) {
    return (b.data.role ?? 0) - (a.data.role ?? 0);
  }
  const orderA = a.data.order ?? 0;
  const orderB = b.data.order ?? 0;
  if (orderA !== orderB) {
    return orderA - orderB;
  }
  return a.label.localeCompare(b.label);
}
