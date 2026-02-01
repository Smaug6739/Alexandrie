import { resolveIcon, resolveNodeLink } from '~/helpers/node';
import type { Node } from '~/stores';

const collapse = useCollapseStates();

let nodes: ComputedRef<Item<Node>[]> | Ref<Item<Node>[]> = ref([]);
const structure = computed(() => new TreeStructure(nodes.value));

/* Do operations in the tree and return the final tree */
const tree = computed(() => {
  return structure.value.generateTree();
});

/* Collapse operations */
const collapseAll = collapse.collapseAllStates;

const expandAll = collapse.expandAllStates;

const isCollapsed = collapse.isAllCollapsed;

/* Get subtree by id as a flat array */

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
              route: resolveNodeLink(node),
              icon: ref(resolveIcon(node)).value,
              data: node,
              show: ref(collapse.getCollapseState(node.id)),
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
          show: ref(collapse.getCollapseState(c.id)),
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
    expandAll,
    isCollapsed,
    getSubTreeById,
    groupedByWorkspace,
    getCategoryFromNode,
    tree,
  };
}

export { useSidebarTree };
