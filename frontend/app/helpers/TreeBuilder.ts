/**
 * TreeBuilder - Pure utility class for tree operations
 * No reactivity, no side effects - just data transformation
 */

/** Base tree node interface */
export interface TreeNode<T = unknown, id = string> {
  id: id;
  parentId?: string | null;
  label: string;
  data: T;
  children?: TreeNode<T>[];
}

/** Extended tree item with routing and display properties */
export interface TreeItem<T = unknown> {
  id: string;
  parentId?: string | null;
  label: string;
  data: T;
  route: string;
  icon?: string;
  children?: TreeItem<T>[];
  onClick?: () => void;
}

/**
 * Builds and manages tree structures from flat arrays
 * Uses Maps for O(1) lookups
 */
export class TreeBuilder<T extends { id: string; parent_id?: string | null }> {
  private readonly items: TreeItem<T>[];
  private readonly itemMap: Map<string, TreeItem<T>>;
  private readonly childrenMap: Map<string, TreeItem<T>[]>;

  constructor(
    sourceItems: T[],
    private readonly transform: (item: T) => Omit<TreeItem<T>, 'children'>,
  ) {
    this.items = sourceItems.map(item => this.transform(item) as TreeItem<T>);
    this.itemMap = new Map(this.items.map(item => [item.id, item]));
    this.childrenMap = new Map();

    for (const item of this.items) {
      const parentId = item.parentId ?? '';
      if (!this.childrenMap.has(parentId)) {
        this.childrenMap.set(parentId, []);
      }
      this.childrenMap.get(parentId)!.push(item);
    }
  }

  /** Get item by ID */
  get(id: string): TreeItem<T> | undefined {
    return this.itemMap.get(id);
  }

  /** Get children of a parent */
  getChildren(parentId?: string | null): TreeItem<T>[] {
    return this.childrenMap.get(parentId ?? '') ?? [];
  }

  /** Build complete tree from roots */
  buildTree(isRoot: (item?: T) => boolean = item => !item?.parent_id): TreeItem<T>[] {
    return this.items
      .filter(item => isRoot(item.data) || !this.itemMap.has(item.parentId ?? ''))
      .map(root => this.buildSubtree(root.id))
      .filter((item): item is TreeItem<T> => item !== undefined);
  }

  /** Build subtree from a specific node */
  buildSubtree(id: string, visited = new Set<string>()): TreeItem<T> | undefined {
    const item = this.itemMap.get(id);
    if (!item || visited.has(id)) return undefined;

    visited.add(id);
    const children = this.getChildren(id)
      .map(child => this.buildSubtree(child.id, new Set(visited)))
      .filter((c): c is TreeItem<T> => c !== undefined);

    return { ...item, children: children.length ? children : undefined };
  }

  /** Flatten a tree back to array */
  flatten(tree: TreeItem<T>[]): TreeItem<T>[] {
    const result: TreeItem<T>[] = [];
    const stack: TreeItem<T>[] = [...tree];
    while (stack.length) {
      const node = stack.pop()!;
      result.push(node);
      if (node.children) stack.push(...(node.children as TreeItem<T>[]));
    }
    return result;
  }

  /** Get next/previous sibling for navigation */
  getSibling(id: string, direction: 'next' | 'prev', filter?: (item?: T) => boolean): TreeItem<T> | undefined {
    const item = this.itemMap.get(id);
    if (!item) return undefined;

    let siblings = this.getChildren(item.parentId);
    if (filter) siblings = siblings.filter(s => filter(s.data));

    const index = siblings.findIndex(s => s.id === id);
    if (index === -1) return undefined;

    const targetIndex = direction === 'next' ? index + 1 : index - 1;
    return siblings[targetIndex];
  }
}

/** Filter tree recursively, keeping branches with matches */
export function filterTree<T extends TreeNode<unknown>>(items: T[], predicate: (item: T) => boolean): T[] {
  const result: T[] = [];
  for (const item of items) {
    const filteredChildren = item.children ? filterTree(item.children as T[], predicate) : [];
    if (predicate(item) || filteredChildren.length > 0) {
      result.push({ ...item, children: filteredChildren.length ? filteredChildren : undefined } as T);
    }
  }
  return result;
}

/** Filter tree by label (case-insensitive) */
export function filterTreeByLabel<T extends TreeNode>(items: T[], query: string): T[] {
  const lowerQuery = query.toLowerCase();
  return filterTree(items, item => item.label.toLowerCase().includes(lowerQuery));
}
