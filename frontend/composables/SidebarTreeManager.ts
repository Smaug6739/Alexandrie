import type { Document, Category } from '~/stores';
import type { DefaultItem } from '../components/Sidebar/helpers';

export interface ANode {
  id: string | number;
  title: string;
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
  private itemMap: Map<string, Item>; // Utilisation de Map pour les recherches rapides

  constructor(public readonly items: Item[]) {
    this.itemMap = new Map(items.map(item => [item.id, item]));
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

  // Generate sub tree
  private buildTree(item: Item): Item {
    const children = this.items.filter(child => child.parent_id === item.id || (child.data.type === 'category' && child.data.workspace_id === item.id));
    return {
      ...item,
      childrens: children.map(child => this.buildTree(child)),
    };
  }
}
