import { type Category } from '~/stores';

function getCollapseState(id: string): boolean {
  const stored = localStorage.getItem(`collapse-${id}`);
  return stored !== 'false';
}

export function useSidebarTree() {
  const categoriesStore = useCategoriesStore();
  const documentsStore = useDocumentsStore();
  const ressourcesStore = useRessourcesStore();
  const preferencesStore = usePreferences();
  const { workspaceId } = useSidebar();

  const categories = computed<Item[]>(() =>
    categoriesStore.categories.map(cat => ({
      id: cat.id,
      parent_id: cat.parent_id || '',
      label: cat.name,
      route: `/dashboard/categories/${cat.id}`,
      icon: cat.icon || 'folder',
      data: cat,
      show: ref(getCollapseState(cat.id)),
    })),
  );

  const documents = computed<Item[]>(() =>
    documentsStore.documents
      .sort((a, b) => b.pinned - a.pinned || a.name.localeCompare(b.name))
      .map(doc => ({
        id: doc.id,
        parent_id: doc.parent_id || doc.category || '',
        label: doc.name,
        route: `/dashboard/docs/${doc.id}`,
        icon: doc.accessibility == 1 ? 'file' : doc.accessibility == 2 ? 'draft' : 'archive',
        data: doc,
        show: ref(getCollapseState(doc.id)),
      })),
  );
  const ressources = computed<Item[]>(() => {
    if (!preferencesStore.get('hideSidebarRessources'))
      return ressourcesStore.getAll
        .filter(res => res.parent_id)
        .map(res => ({
          id: res.id,
          parent_id: res.parent_id || '',
          label: res.filename,
          route: `/dashboard/cdn/${res.id}/preview`,
          icon: res.filetype == 'application/pdf' ? 'pdf' : 'image',
          data: res,
          show: ref(true),
        }));
    return [];
  });

  const allItems = computed(() => [...documents.value, ...ressources.value, ...categories.value.filter(cat => (cat as Item<Category>).data.role == 1)]);
  const structure = computed(() => new TreeStructure(allItems.value));

  const tree = computed(() => {
    // Special icons:
    if (!preferencesStore.get('normalizeFileIcons')) {
      for (const i of structure.value.childrenMap.keys()) {
        const ref = structure.value.itemMap.get(i);
        const subs = structure.value.childrenMap.get(i);
        if (ref?.data.type === 'document' && subs?.some(c => c.data.type != 'ressource')) structure.value.itemMap.get(i)!.icon = 'file_parent';
      }
    }
    return structure.value.generateTree();
  });

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
    return structure.value.treeToArray(structure.value.getSubTreeById(id)?.childrens || []);
  };

  return {
    structure,
    getSubTreeById,
    categories,
    tree,
    filtered,
    collapseAll,
  };
}
