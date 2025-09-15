// useSidebarTree.ts
import type { DefaultItem } from '~/components/Sidebar/helpers';
import type { Category, Document, Ressource } from '~/stores';

const preferencesStore = usePreferences();
const { workspaceId } = useSidebar();

let categories: ComputedRef<Item<Category>[]> | Ref<Item<Category>[]> = ref([]);
let documents: ComputedRef<Item<Document>[]> | Ref<Item<Document>[]> = ref([]);
let ressources: ComputedRef<Item<Ressource>[]> | Ref<Item<Ressource>[]> = ref([]);
const structure = computed(() => new TreeStructure(allItems.value));
const allItems = computed(() => [...documents.value, ...ressources.value, ...categories.value.filter(cat => cat.data.role == 2)]);

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

const filtered = computed(() =>
  tree.value.filter(item => {
    if ((item.data.type === 'category' || item.data.type === 'document') && workspaceId.value) return item.data.parent_id === workspaceId.value;
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

function useSidebarTree() {
  const categoriesStore = useCategoriesStore();
  const documentsStore = useDocumentsStore();
  const ressourcesStore = useRessourcesStore();

  // Wait for categories and documents to be fetched
  const isReady = computed(() => !categoriesStore.isFetching && !documentsStore.isFetching && !ressourcesStore.isFetching);

  if (!documents.value.length) {
    categories = computed<Item<Category>[]>(() =>
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
  }

  if (!documents.value.length) {
    documents = computed(() =>
      isReady.value
        ? documentsStore.documents
            .sort((a, b) => b.pinned - a.pinned || a.name.localeCompare(b.name))
            .map(doc => ({
              id: doc.id,
              parent_id: doc.parent_id || '',
              label: doc.name,
              route: `/dashboard/docs/${doc.id}`,
              icon: doc.accessibility == 1 ? 'file' : doc.accessibility == 2 ? 'draft' : 'shared_doc',
              data: doc,
              show: ref(getCollapseState(doc.id)),
            }))
        : [],
    );
  }

  if (!ressources.value) {
    ressources = computed<Item<Ressource>[]>(() => {
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
  }

  const groupedByWorkspace = () => {
    const workspaces: Item<Category | Document | Ressource | DefaultItem>[] = [
      ...categoriesStore.getAll
        .filter(c => c.role === 1)
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

  const getCategoryFromNode = (parentId?: string | null) => {
    let category: Item<Category> | null = null;
    let parent_id: string | undefined | null = parentId;
    while (parent_id) {
      const parent = structure.value.itemMap.get(parent_id);
      if (parent?.data.role === 2) {
        category = parent as Item<Category>;
        break;
      }
      parent_id = parent?.parent_id;
    }
    return category;
  };

  return {
    structure,
    collapseAll,
    getSubTreeById,
    groupedByWorkspace,
    getCategoryFromNode,
    categories,
    tree,
    filtered,
  };
}

export { useSidebarTree, tree, filtered };
