import type { Document, Category } from '~/stores';
import type { DefaultItem } from '../components/Sidebar/helpers';

export interface Item<T = Document | Category | DefaultItem> {
  id: string;
  title: string;
  route: string;
  parent_id: string;
  data: T;
  childrens?: Item<T>[];
  show: Ref<boolean>;
}
export class ItemsManager {
  private itemMap: Map<string, Item>; // Utilisation de Map pour les recherches rapides

  constructor(public readonly items: Item[]) {
    this.itemMap = new Map(items.map(item => [item.id, item]));
  }

  // Récupère un élément par son ID
  public getItem(id: string): Item | undefined {
    return this.itemMap.get(id);
  }

  // Génère l'arbre dynamiquement, sans indexation préalable
  public generateTree(): Item[] {
    return this.items
      .filter(item => item.parent_id === '' || !this.itemMap.has(item.parent_id) || (item.data.type === 'category' && item.data.role === 2)) // Racines
      .map(rootItem => this.buildTree(rootItem));
  }

  // Construit un sous-arbre dynamiquement
  private buildTree(item: Item): Item {
    const children = this.items.filter(child => child.parent_id === item.id || (child.data.type === 'category' && child.data.workspace_id === item.id));
    return {
      ...item,
      childrens: children.map(child => this.buildTree(child)),
    };
  }
}
