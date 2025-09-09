// useSidebarTree.ts
import type { DefaultItem } from '~/components/Sidebar/helpers';
import type { Category, Document, Ressource } from '~/stores';

export function useSidebarTree() {
  const categoriesStore = useCategoriesStore();
  const documentsStore = useDocumentsStore();
  const ressourcesStore = useRessourcesStore();
  const preferencesStore = usePreferences();
  const { workspaceId } = useSidebar();

  // Wait for categories and documents to be fetched
  const isReady = computed(() => !categoriesStore.isFetching && !documentsStore.isFetching && !ressourcesStore.isFetching);

  const categories = computed<Item<Category>[]>(() =>
    isReady.value
      ? categoriesStore.categories.map(cat => ({
          id: cat.id,
          parent_id: cat.parent_id || '',
          label: cat.name,
          route: `/dashboard/categories/${cat.id}`,
          icon: cat.icon || 'folder',
          data: cat,
          show: ref(getCollapseState(cat.id)),
        }))
      : [],
  );

  const documents = computed<Item<Document>[]>(() =>
    isReady.value
      ? documentsStore.documents
          .sort((a, b) => b.pinned - a.pinned || a.name.localeCompare(b.name))
          .map(doc => ({
            id: doc.id,
            parent_id: doc.parent_id || doc.category || '',
            label: doc.name,
            route: `/dashboard/docs/${doc.id}`,
            icon: doc.accessibility == 1 ? 'file' : doc.accessibility == 2 ? 'draft' : 'shared_doc',
            data: doc,
            show: ref(getCollapseState(doc.id)),
          }))
      : [],
  );
  const ressources = computed<Item<Ressource>[]>(() => {
    if (!preferencesStore.get('hideSidebarRessources').value && isReady.value)
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

  const allItems = computed(() => [...documents.value, ...ressources.value, ...categories.value.filter(cat => cat.data.role == 1)]);
  const structure = computed(() => new TreeStructure(allItems.value));

  // Tree with normalized icons
  const tree = computed(() => {
    if (!preferencesStore.get('normalizeFileIcons').value) {
      for (const i of structure.value.childrenMap.keys()) {
        const ref = structure.value.itemMap.get(i);
        const subs = structure.value.childrenMap.get(i);
        if (ref?.data.type === 'document' && subs?.some(c => c.data.type != 'ressource')) {
          structure.value.itemMap.get(i)!.icon = 'file_parent';
        }
      }
    }
    return structure.value.generateTree();
  });

  // Filtered tree based on workspace
  const filtered = computed(() =>
    tree.value.filter(item => {
      if (item.data.type === 'category' && workspaceId.value) return item.data.parent_id === workspaceId.value && item.data.role == 1;
      if (item.data.type === 'document' && workspaceId.value) return item.data.category === workspaceId.value;
      return true;
    }),
  );
  const collapseAll = () => {
    allItems.value.forEach(item => {
      if (item.show.value) item.show.value = false;
      collapseAllStates();
    });
  };
  const getSubTreeById = (id: string) => {
    return structure.value.treeToArray(structure.value.getSubTreeById(id)?.childrens || []);
  };

  const groupedByWorkspace = () => {
    const workspaces: Item<Category | Document | Ressource | DefaultItem>[] = [
      ...categoriesStore.getAll
        .filter(c => c.role === 2)
        .map(c => ({
          id: c.id,
          parent_id: c.parent_id || '',
          label: c.name,
          route: `/dashboard/categories/${c.id}`,
          icon: c.icon || 'folder',
          data: c,
          show: ref(getCollapseState(c.id)),
        })),
    ];

    tree.value.forEach(item => {
      const workspaceId = item.parent_id;
      const existing = workspaces.find(w => w.id === workspaceId);
      if (!existing) workspaces.push(item);
      else {
        if (existing.childrens) existing.childrens.push(item);
        else existing.childrens = [item];
      }
    });
    return workspaces;
  };

  return {
    structure,
    collapseAll,
    getSubTreeById,
    groupedByWorkspace,
    categories,
    tree,
    filtered,
  };
}
