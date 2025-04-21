export interface ANode<T = any> {
  id: string;
  title: string;
  icon?: string;
  route?: string;
  parent_id: string;
  children: ANode[];
  data: T;
}

export class TreeManager<T> {
  private nodeMap: Map<string, ANode<T>> = new Map();
  public items: ANode<T>[] = [];

  constructor(items: ANode<T>[]) {
    this.nodeMap = new Map(items.map(item => [item.id, item]));
    this.items = items;
  }

  public buildTree() {
    return this.items
      .filter(item => item.parent_id === '' || !this.nodeMap.has(item.parent_id)) // Racines
      .map(rootItem => this.buildSubTree(rootItem));
  }
  private buildSubTree(item: ANode<T>): ANode<T> {
    const children = this.items.filter(child => child.parent_id === item.id);
    return {
      ...item,
      children: children.map(child => this.buildSubTree(child)),
    };
  }
}
