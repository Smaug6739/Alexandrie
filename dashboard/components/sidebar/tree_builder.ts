import type { Document, Category } from '~/store';
import type { DefaultItem } from './helpers';

export interface Item {
  id: string;
  title: string;
  route: string;
  parent_id: string;
  data: Document | Category | DefaultItem;
  childrens?: Item[];
}

export class ItemsManager {
  constructor(public readonly items: Item[]) {}

  public getItem(id: string): Item | undefined {
    return this.items.find(item => item.id === id);
  }

  public generateTree(): Item[] {
    const tree: Item[] = [];
    const rootItems = this.items.filter(item => item.parent_id === ''); // Get root items
    rootItems.forEach(rootItem => {
      const childrens = this.getChildrens(rootItem);
      tree.push({ ...rootItem, childrens });
    });
    return tree;
  }

  private getChildrens(parent: Item): Item[] {
    const childrens = this.items.filter(item => item.parent_id === parent.id);
    childrens.forEach(child => {
      child.childrens = this.getChildrens(child);
    });
    return childrens;
  }
}
