import type { Node } from '~/stores';

let nodes: ComputedRef<Item<Node>[]> | Ref<Item<Node>[]> = ref([]);
const structure = computed(() => new TreeStructure(nodes.value));

const resolveIcon = (item: Node) => {
  if (item.icon) return item.icon;
  if (item.role === 1) return 'workspace';
  if (item.role === 2) return item.shared ? 'shared_folder' : 'folder';
  if (item.role === 3) return item.accessibility == 1 ? 'sidebar/file' : item.accessibility == 2 ? 'draft' : 'shared_doc';
  if (item.role === 4) return item.metadata?.filetype == 'application/pdf' ? 'pdf' : 'sidebar/image';
  return 'sidebar/file';
};

const resolveLink = (item: Node) => {
  if (item.role === 1 || item.role === 2) return `/dashboard/categories/${item.id}`;
  if (item.role === 3) return `/dashboard/docs/${item.id}`;
  if (item.role === 4) return `/dashboard/cdn/${item.id}/preview`;
  return '/dashboard';
};

/* Do operations in the tree and return the final tree */
const tree = computed(() => {
  return structure.value.generateTree();
});

const collapseAll = collapseAllStates;
const getSubTreeById = (id: string) => {
  return structure.value.treeToArray(structure.value.getSubTreeById(id)?.childrens || []);
};

function useSidebarTree() {
  const nodesStore = useNodesStore();

  // Wait for categories and documents to be fetched
  const isReady = computed(() => !nodesStore.isFetching);

  if (!nodes.value.length) {
    nodes = computed(() =>
      isReady.value
        ? nodesStore.nodes
            .map<Item<Node>>(node => ({
              id: node.id,
              parent_id: node.role !== 1 ? node.parent_id || '' : '',
              label: node.name,
              route: resolveLink(node),
              icon: ref(resolveIcon(node)).value,
              data: node,
              show: ref(getCollapseState(node.id)),
            }))
            .sort((a, b) => (a.data.order ?? 0) - (b.data.order ?? 0) || a.data.name.localeCompare(b.data.name))
        : [],
    );
  }

  const groupedByWorkspace = (roles = [1, 2, 3]) => {
    const workspaces: Item<Node>[] = [
      ...nodesStore.getAll
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
      if (!roles.includes(item.data.role)) return;
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
    let category: Item<Node> | null = null;
    let parent_id: string | undefined | null = parentId;
    while (parent_id) {
      const parent = structure.value.itemMap.get(parent_id);
      if (parent?.data.role === 2 || parent?.data.role === 1) {
        category = parent as Item<Node>;
        break;
      }
      parent_id = parent?.parent_id;
    }
    return category;
  };

  return {
    structure,
    nodes,
    collapseAll,
    getSubTreeById,
    groupedByWorkspace,
    getCategoryFromNode,
    tree,
  };
}

export { useSidebarTree };
