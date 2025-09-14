import type { Node } from '~/stores';
import type { DefaultItem } from '../components/Sidebar/helpers';

export interface ANode {
  id: string | number;
  label: string;
  parent_id?: string;
  childrens?: ANode[];
}

export interface Item<T = Node | DefaultItem> extends ANode {
  id: string;
  route: string;
  data: T;
  show: Ref<boolean>;
  childrens?: Item<T>[];
  icon?: string;
}

export class TreeStructure {
  public readonly items: Item[];

  public readonly itemMap: Map<string, Item>; // Map for quick access by ID

  public readonly childrenMap: Map<string, Item[]>; // Map for quick access to children by parent ID

  constructor(items: Item[]) {
    this.items = items;
    this.itemMap = new Map(items.map(item => [item.id, item]));
    this.childrenMap = new Map();
    for (const item of items) {
      if (!this.childrenMap.has(item.parent_id || '')) this.childrenMap.set(item.parent_id || '', []);
      this.childrenMap.get(item.parent_id!)!.push(item);
    }
  }

  // Get item by ID
  public getItem(id: string): Item | undefined {
    return this.itemMap.get(id);
  }

  public generateTree(): Item[] {
    return this.items
      .filter(item => item.data.role === 1 || item.parent_id === '' || (item.parent_id && !this.itemMap.has(item.parent_id || '')))
      .map(root => this.buildTree(root, new Set()));
  }
  public getSubTreeById(id: string): Item | undefined {
    const root = this.getItem(id);
    if (!root) return undefined;
    return this.buildTree(root, new Set());
  }
  public treeToArray(tree: Item[]): Item[] {
    const result: Item[] = [];
    const stack: Item[] = [...tree];
    while (stack.length) {
      const node = stack.pop()!;
      result.push(node);
      if (node.childrens) {
        stack.push(...node.childrens);
      }
    }
    return result;
  }

  // Generate sub tree
  private buildTree(item: Item, visited: Set<string> = new Set()): Item {
    // Prevent infinite recursion by checking if we've already visited this item
    if (visited.has(item.id)) {
      return { ...item, childrens: [] };
    }

    visited.add(item.id);
    const children = this.childrenMap.get(item.id) || [];
    const newVisited = new Set(visited);

    return {
      ...item,
      childrens: children.map(child => this.buildTree(child, newVisited)),
    };
  }
}
export const filterRecursive = <T extends ANode>(items: T[], filter: Ref<string>): T[] => {
  return items
    .map(item => {
      const matches = item.label.toLowerCase().includes(filter.value.toLowerCase());
      const filteredChildren = item.childrens ? filterRecursive(item.childrens, filter) : [];
      if (matches || filteredChildren.length > 0) {
        return { ...item, childrens: filteredChildren };
      }
      return null;
    })
    .filter(Boolean) as T[];
};
