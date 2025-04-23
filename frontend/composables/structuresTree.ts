import { useCategoriesStore, useDocumentsStore, type Category } from '~/stores';

function getCollapseState(id: string): boolean {
  const stored = localStorage.getItem(`collapse-${id}`);
  return stored !== 'false';
}

export function useSidebarTree() {
  const categoriesStore = useCategoriesStore();
  const documentsStore = useDocumentsStore();
  const { workspaceId } = useSidebar();

  const categories = computed<Item[]>(() =>
    categoriesStore.categories.map(cat => ({
      id: cat.id,
      parent_id: cat.parent_id || '',
      title: cat.name,
      route: cat.parent_id ? `/dashboard/categories/${cat.id}` : '',
      icon: cat.icon,
      type: 'category',
      data: cat,
      show: ref(getCollapseState(cat.id)),
    })),
  );

  const documents = computed<Item[]>(() =>
    documentsStore.documents.map(doc => ({
      id: doc.id,
      parent_id: doc.parent_id || doc.category || '',
      title: doc.name,
      route: `/dashboard/docs/${doc.id}`,
      type: 'document',
      data: doc,
      show: ref(getCollapseState(doc.id)),
    })),
  );

  const allItems = computed(() => [...documents.value, ...categories.value.filter(cat => (cat as Item<Category>).data.role == 1)]);
  const structure = new TreeStructure(allItems.value);

  const tree = computed(() => structure.generateTree());

  const filtered = computed(() => {
    return tree.value.filter(item => {
      if (item.data.type === 'category' && workspaceId.value) return item.data.workspace_id === workspaceId.value && item.data.role == 1;
      if (item.data.type === 'document' && workspaceId.value) return item.data.category === workspaceId.value;
      return true;
    });
  });

  const collapseAll = () => {
    tree.value.forEach(item => {
      if (item.show.value) {
        localStorage.setItem(`collapse-${item.id}`, 'false');
        item.show.value = false;
      }
    });
  };
  const getSubTreeById = (id: string) => {
    return structure.treeToArray(structure.getSubTreeById(id)?.childrens || []);
  };

  return {
    getSubTreeById,
    categories,
    tree,
    filtered,
    collapseAll,
  };
}
