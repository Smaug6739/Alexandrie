// useSidebarTree.ts
import type { Category, Document, Ressource } from '~/stores';

let initialized = false;

let categories: ComputedRef<Item<Category>[]>;
let documents: ComputedRef<Item[]>;
let ressources: ComputedRef<Item[]>;
let allItems: ComputedRef<Item[]>;
let structure: ComputedRef<TreeStructure>;
let tree: ComputedRef<Item[]>;
let filtered: ComputedRef<Item[]>;

export function useSidebarTree() {
  const categoriesStore = useCategoriesStore();
  const documentsStore = useDocumentsStore();
  const ressourcesStore = useRessourcesStore();
  const preferencesStore = usePreferences();
  const { workspaceId } = useSidebar();

  if (!initialized) {
    initialized = true;

    // Categories
    categories = computed(() =>
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

    // Documents
    documents = computed(() =>
      documentsStore.documents
        .slice() // éviter mutation
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

    // Ressources
    ressources = computed(() => {
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

    allItems = computed(() => [...documents.value, ...ressources.value, ...categories.value.filter(cat => (cat as Item<Category>).data.role == 1)]);
    // Structure
    structure = computed(() => new TreeStructure(allItems.value));

    // Tree with normalized icons
    tree = computed(() => {
      if (!preferencesStore.get('normalizeFileIcons')) {
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
    filtered = computed(() =>
      tree.value.filter(item => {
        if (item.data.type === 'category' && workspaceId.value) return item.data.workspace_id === workspaceId.value && item.data.role == 1;
        if (item.data.type === 'document' && workspaceId.value) return item.data.category === workspaceId.value;
        return true;
      }),
    );
  }
  const collapseAll = () => {
    allItems.value.forEach(item => {
      if (item.show.value) item.show.value = false;
      collapseAllStates();
    });
  };
  const getSubTreeById = (id: string) => {
    return structure.value.treeToArray(structure.value.getSubTreeById(id)?.childrens || []);
  };

  return {
    structure,
    collapseAll,
    getSubTreeById,
    categories,
    tree,
    filtered,
  };
}
