import type { Document, Category, Ressource } from '~/stores';
import type { DefaultItem } from '../components/Sidebar/helpers';

export interface ANode {
  id: string | number;
  label: string;
  parent_id?: string;
  childrens?: ANode[];
}

export interface Item<T = Document | Category | DefaultItem | Ressource> extends ANode {
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

  private rootTree: Item[];

  constructor(items: Item[]) {
    console.log('MAIN: TreeStructure initialized with items:', items.length);
    this.items = items;
    this.itemMap = new Map(items.map(item => [item.id, item]));
    this.childrenMap = new Map();

    for (const item of items) {
      if (!this.childrenMap.has(item.parent_id || '')) this.childrenMap.set(item.parent_id || '', []);
      this.childrenMap.get(item.parent_id || '')!.push(item);
    }

    this.rootTree = this.buildRootTree(); // calculé une seule fois
  }

  // Get item by ID
  public getItem(id: string): Item | undefined {
    return this.itemMap.get(id);
  }

  // Generate the tree structure without indexing
  private buildRootTree(): Item[] {
    console.log('TreeStructure reconstructed');
    return this.items.filter(item => item.parent_id === '' || !this.itemMap.has(item.parent_id || '') || (item.data.type === 'category' && item.data.role === 2)).map(root => this.buildTree(root));
  }

  public generateTree(): Item[] {
    return this.items.filter(item => item.parent_id === '' || !this.itemMap.has(item.parent_id || '') || (item.data.type === 'category' && item.data.role === 2)).map(root => this.buildTree(root));
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
