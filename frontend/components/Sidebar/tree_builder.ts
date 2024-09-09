import type { Document, Category } from '~/stores';
import type { DefaultItem } from './helpers';

export interface Item {
  id: string;
  title: string;
  route: string;
  parent_id: string;
  data: Document | Category | DefaultItem;
  childrens?: Item[];
  show: Ref<boolean>;
}

export class ItemsManager {
  private itemMap: Record<string, Item>; // Utilisation d'un objet pour stocker les éléments par ID

  constructor(public readonly items: Item[]) {
    this.itemMap = this.createItemMap(items);
  }

  private createItemMap(items: Item[]): Record<string, Item> {
    const itemMap: Record<string, Item> = {};
    items.forEach(item => {
      itemMap[item.id] = item;
    });
    return itemMap;
  }

  public getItem(id: string): Item | undefined {
    return this.itemMap[id];
  }

  public generateTree(): Item[] {
    const tree: Item[] = [];
    const rootItems = this.items.filter(item => item.parent_id === '' || !this.itemMap[item.parent_id]); // Get root items
    rootItems.forEach(rootItem => {
      const childrens = this.getChildrens(rootItem);
      tree.push({ ...rootItem, childrens });
    });
    return tree;
  }

  private getChildrens(parent: Item): Item[] {
    const childrens: Item[] = [];
    this.items.forEach(item => {
      if (item.parent_id === parent.id) {
        const child = { ...item };
        child.childrens = this.getChildrens(item); // Utilisation de la récursivité
        childrens.push(child);
      }
    });
    return childrens;
  }
}
