import type { TreeItem } from '~/helpers/TreeBuilder';
import type { Node } from '~/stores';

export function useNodesSort() {
  const preferences = usePreferencesStore();
  const sortKey = preferences.get('sortKey');
  const sortOrder = preferences.get('sortOrder');

  function sortItems<
    T extends { id: string; parent_id?: string | null; role?: number; order?: number; created_timestamp?: number; updated_timestamp?: number },
  >(a: TreeItem<T>, b: TreeItem<T>) {
    if (a.data.role !== b.data.role) {
      return (b.data.role ?? 0) - (a.data.role ?? 0);
    }
    const orderA = a.data.order ?? 0;
    const orderB = b.data.order ?? 0;
    if (orderA !== orderB) {
      return orderA - orderB;
    }
    let comparison = 0;
    if (sortKey.value === 'name') {
      comparison = a.label.localeCompare(b.label);
    } else if (sortKey.value === 'created') {
      comparison = (a.data.created_timestamp ?? 0) - (b.data.created_timestamp ?? 0);
    } else if (sortKey.value === 'modified') {
      comparison = (a.data.updated_timestamp ?? 0) - (b.data.updated_timestamp ?? 0);
    }

    return sortOrder.value === 'ascending' ? comparison : -comparison;
  }

  function sortNodes(a: Node, b: Node) {
    if (a.role !== b.role) {
      return (b.role ?? 0) - (a.role ?? 0);
    }
    const orderA = a.order ?? 0;
    const orderB = b.order ?? 0;
    if (orderA !== orderB) {
      return orderA - orderB;
    }
    let comparison = 0;
    if (sortKey.value === 'name') {
      comparison = a.name.localeCompare(b.name);
    } else if (sortKey.value === 'created') {
      comparison = a.created_timestamp - b.created_timestamp;
    } else if (sortKey.value === 'modified') {
      comparison = a.updated_timestamp - b.updated_timestamp;
    }

    return sortOrder.value === 'ascending' ? comparison : -comparison;
  }

  return {
    sortItems,
    sortNodes,
  };
}
