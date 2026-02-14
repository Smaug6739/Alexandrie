/**
 * Nodes Tree Composable
 * Single source of truth for the hierarchical node structure
 */
import type { Node } from '~/stores';
import { TreeBuilder, type TreeItem } from '~/helpers/TreeBuilder';
import { resolveIcon, resolveNodeLink } from '~/helpers/node';

// ============================================================================
// Collapse States (localStorage persistence)
// ============================================================================
const COLLAPSE_STORAGE_KEY = 'collapse-states';

function createCollapseStore() {
  const states = ref<Record<string, boolean>>({});
  let initialized = false;

  function init() {
    if (initialized || import.meta.server) return;
    try {
      const raw = localStorage.getItem(COLLAPSE_STORAGE_KEY);
      states.value = raw ? JSON.parse(raw) : {};
    } catch {
      states.value = {};
    }
    initialized = true;
  }

  function save() {
    if (import.meta.server) return;
    localStorage.setItem(COLLAPSE_STORAGE_KEY, JSON.stringify(states.value));
  }

  return {
    isExpanded: (id: string) => {
      init();
      const state = states.value[id];
      if (state === undefined) {
        states.value[id] = true;
        return true;
      }
      return state ?? true;
    },
    setExpanded: (id: string, value: boolean) => {
      init();
      states.value[id] = value;
      save();
    },
    toggle: (id: string) => {
      init();
      states.value[id] = !(states.value[id] ?? true);
      save();
    },
    setAll: (expanded: boolean) => {
      init();
      Object.keys(states.value).forEach(key => (states.value[key] = expanded));
      save();
    },
    isAllCollapsed: () => {
      init();
      return Object.values(states.value).every(v => v === false);
    },
  };
}

// Singleton collapse store
const collapseStore = createCollapseStore();

// ============================================================================
// Main Composable
// ============================================================================

/** Transform Node to TreeItem */
function transformNode(node: Node): Omit<TreeItem<Node>, 'children'> {
  return {
    id: node.id,
    parentId: node.role === 1 ? null : (node.parent_id ?? null),
    label: node.name,
    route: resolveNodeLink(node),
    icon: resolveIcon(node),
    data: node,
  };
}

export function useNodesTree() {
  const nodesStore = useNodesStore();

  // Sorted nodes
  const sortedNodes = computed(() => nodesStore.nodes.toArray().sort((a, b) => (a.order ?? 0) - (b.order ?? 0) || a.name.localeCompare(b.name)));

  // Tree builder instance (recreated when nodes change)
  const builder = computed(() => new TreeBuilder(sortedNodes.value, transformNode));

  // Full tree
  const tree = computed(() => {
    const tree = builder.value.buildTree(node => node?.role === 1);
    return tree;
  });

  const treeUpToRole = (maxRole: number) =>
    computed(() => {
      const filtered = sortedNodes.value.filter(n => n.role <= maxRole);
      return new TreeBuilder(filtered, transformNode).buildTree(node => node?.role === 1);
    });

  // === Filtered views ===
  const workspaceTree = (workspaceId?: string): TreeItem<Node>[] => {
    if (!workspaceId) return tree.value;
    if (workspaceId === 'shared') {
      return tree.value.filter(item => item.data?.shared);
    }
    const workspace = tree.value.find(item => item.id === workspaceId);
    if (!workspace) return tree.value;
    return (workspace?.children as TreeItem<Node>[]) ?? [];
  };

  // === Get subtree as flat array ===
  const getSubtreeAsArray = (id: string): TreeItem<Node>[] => {
    const subtree = builder.value.buildSubtree(id);
    return subtree?.children ? builder.value.flatten(subtree.children as TreeItem<Node>[]) : [];
  };

  // === Navigation ===
  const getAncestorCategory = (nodeId?: string | null): TreeItem<Node> | null => {
    if (!nodeId) return null;
    let current = builder.value.get(nodeId);
    while (current?.parentId) {
      const parent = builder.value.get(current.parentId);
      if (parent && (parent.data?.role === 1 || parent.data?.role === 2)) {
        return parent;
      }
      current = parent;
    }
    return null;
  };

  const nextDocument = (id?: string) => (id ? builder.value.getSibling(id, 'next', n => n?.role === 3)?.data : undefined);
  const prevDocument = (id?: string) => (id ? builder.value.getSibling(id, 'prev', n => n?.role === 3)?.data : undefined);

  // === Get children of a node ===
  const getChildren = (parentId?: string | null): TreeItem<Node>[] => {
    return builder.value.getChildren(parentId ?? null);
  };

  return {
    // Tree data
    tree,
    treeUpToRole,
    workspaceTree,
    getSubtreeAsArray,
    getAncestorCategory,
    getChildren,
    builder,

    // Navigation
    nextDocument,
    prevDocument,

    // Collapse state
    isExpanded: collapseStore.isExpanded,
    setExpanded: collapseStore.setExpanded,
    toggleExpand: collapseStore.toggle,
    expandAll: () => collapseStore.setAll(true),
    collapseAll: () => collapseStore.setAll(false),
    isAllCollapsed: collapseStore.isAllCollapsed,
  };
}

// Legacy alias for backward compatibility during migration
export { useNodesTree as useSidebarTree };
