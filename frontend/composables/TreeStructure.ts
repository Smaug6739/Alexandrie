import type { Document, Category } from '~/stores';
import type { DefaultItem } from '../components/Sidebar/helpers';

export interface ANode {
  id: string | number;
  label: string;
  parent_id: string;
  childrens?: ANode[];
}

export interface Item<T = Document | Category | DefaultItem> extends ANode {
  id: string;
  route: string;
  data: T;
  show: Ref<boolean>;
  childrens?: Item<T>[];
}
export class TreeStructure {
  public readonly items: Item[];
  private itemMap: Map<string, Item>; // Utilisation de Map pour les recherches rapides
  private childrenMap: Map<string, Item[]>; // Utilisation de Map pour les recherches rapides
  constructor(items: Item[]) {
    this.items = items;
    this.itemMap = new Map(items.map(item => [item.id, item]));
    this.childrenMap = new Map();

    for (const item of items) {
      if (!this.childrenMap.has(item.parent_id)) {
        this.childrenMap.set(item.parent_id, []);
      }
      this.childrenMap.get(item.parent_id)!.push(item);
    }
  }

  // Get item by ID
  public getItem(id: string): Item | undefined {
    return this.itemMap.get(id);
  }

  // Generate the tree structure without indexing
  public generateTree(): Item[] {
    return this.items
      .filter(item => item.parent_id === '' || !this.itemMap.has(item.parent_id) || (item.data.type === 'category' && item.data.role === 2)) // Racines
      .map(rootItem => this.buildTree(rootItem));
  }
  public getSubTreeById(id: string): Item | undefined {
    const root = this.getItem(id);
    if (!root) return undefined;
    return this.buildTree(root);
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
  private buildTree(item: Item): Item {
    const children = this.childrenMap.get(item.id) || [];
    return {
      ...item,
      childrens: children.map(child => this.buildTree(child)),
    };
  }
}
