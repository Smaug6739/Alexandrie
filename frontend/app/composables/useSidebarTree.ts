import type { Category, Document, Ressource } from '~/stores';

let initialized = false;
const documents = shallowRef<Item<Document>[]>([]);
const categories = shallowRef<Item<Category>[]>([]);
const ressources = shallowRef<Item<Ressource>[]>([]);
const collapseStates = new Map<string, Ref<boolean>>();
const allItems = shallowRef<Item[]>([]);
const structure = shallowRef<TreeStructure>(new TreeStructure(allItems.value));
const tree = shallowRef<Item[]>([]);

export function useSidebarTree() {
  const categoriesStore = useCategoriesStore();
  const documentsStore = useDocumentsStore();
  const ressourcesStore = useRessourcesStore();
  const preferencesStore = usePreferences();
  const { workspaceId } = useSidebar();

  // **************************************************************
  // Helper to get "Itemized" categories, documents, and ressources
  // **************************************************************
  if (!initialized) {
    for (const c of categoriesStore.categories) {
      collapseStates.set(c.id, ref(getCollapseState(c.id)));
    }
    for (const d of documentsStore.documents) {
      collapseStates.set(d.id, ref(getCollapseState(d.id)));
    }
    categories.value = categoriesStore.categories.map(cat => ({
      id: cat.id,
      parent_id: cat.parent_id || '',
      label: cat.name,
      route: `/dashboard/categories/${cat.id}`,
      icon: cat.icon || 'folder',
      data: cat,
      show: collapseStates.get(cat.id)!,
    }));

    documents.value = documentsStore.documents
      .slice()
      .sort((a, b) => b.pinned - a.pinned || a.name.localeCompare(b.name))
      .map(doc => ({
        id: doc.id,
        parent_id: doc.parent_id || doc.category || '',
        label: doc.name,
        route: `/dashboard/docs/${doc.id}`,
        icon: doc.accessibility == 1 ? 'file' : doc.accessibility == 2 ? 'draft' : 'archive',
        data: doc,
        show: collapseStates.get(doc.id)!,
      }));

    ressources.value = preferencesStore.get('hideSidebarRessources')
      ? []
      : ressourcesStore.getAll
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

    allItems.value = [...documents.value, ...ressources.value, ...categories.value.filter(cat => (cat as Item<Category>).data.role == 1)];

    structure.value = new TreeStructure(allItems.value);

    // gestion des icônes spéciales
    if (!preferencesStore.get('normalizeFileIcons')) {
      for (const i of structure.value.childrenMap.keys()) {
        const ref = structure.value.itemMap.get(i);
        const subs = structure.value.childrenMap.get(i);
        if (ref?.data.type === 'document' && subs?.some(c => c.data.type != 'ressource')) {
          structure.value.itemMap.get(i)!.icon = 'file_parent';
        }
      }
    }

    tree.value = structure.value.generateTree();
  }
  // **************************************************************

  const filtered = computed(() => {
    return tree.value.filter(item => {
      if (item.data.type === 'category' && workspaceId.value) return item.data.workspace_id === workspaceId.value && item.data.role == 1;
      if (item.data.type === 'document' && workspaceId.value) return item.data.category === workspaceId.value;
      return true;
    });
  });

  const getSubTreeById = (id: string) => {
    return structure.value.treeToArray(structure.value.getSubTreeById(id)?.childrens || []);
  };

  return {
    structure,
    getSubTreeById,
    categories,
    tree,
    filtered,
  };
}
