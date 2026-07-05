/**
 * Nodes Tree Composable
 * Single source of truth for the hierarchical node structure
 */
import { TreeBuilder, flattenTree, filterTree, type TreeItem } from '~/helpers/TreeBuilder';
import { resolveIcon, resolveNodeLink } from '~/helpers/node';
import type { Node } from '~/stores';

let globalBuilder: TreeBuilder<Node> | null = null;
let globalTree: ComputedRef<TreeItem<Node>[]> | null = null;
let globalTreeMap: ComputedRef<Map<string, TreeItem<Node>>> | null = null;

function initGlobalTree() {
  const nodesStore = useNodesStore();

  if (!globalBuilder) {
    globalBuilder = new TreeBuilder<Node>(toRaw(nodesStore.nodes), transformNode);
  }

  if (!globalTree) {
    globalTree = computed(() => {
      console.debug('[useNodesTree] 🌳 Rebuilding global tree from store trigger');

      globalBuilder!.clearCache();

      return globalBuilder!.buildTree({
        rootFilter: node => {
          if (node?.role === 0) return false;
          // Un nœud est une racine s'il n'a pas de parent ou si son parent n'est pas dans le store
          return !node.parent_id || !nodesStore.getById(node.parent_id);
        },
      });
    });

    globalTreeMap = computed(() => {
      console.debug('[useNodesTree] 🗺️ Building global tree map from computed tree');
      const map = new Map<string, TreeItem<Node>>();
      const flat = flattenTree(globalTree!.value);
      for (const item of flat) {
        map.set(item.id, item);
      }
      return map;
    });
  }
}

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
  const collapseStore = useCollapseStore();

  initGlobalTree();

  const tree = globalTree!;
  const treeMap = globalTreeMap!;

  const getTreeUpToRole = (maxRole: number) =>
    computed(() => {
      return filterTree(tree.value, item => (item.data?.role ?? 0) <= maxRole);
    });

  /**
   * Get the tree structure for a specific workspace, optionally including the full subtree
   */
  const getWorkspaceTree = (workspaceId?: string, fullTree: boolean = false): TreeItem<Node>[] => {
    if (!workspaceId) return tree.value;

    if (workspaceId === 'shared') {
      return tree.value.filter(item => item.data?.shared);
    }

    const cachedItem = treeMap.value.get(workspaceId);
    if (!cachedItem) return [];

    if (fullTree) return [cachedItem];
    return cachedItem.children ?? [];
  };

  /**
   * Get the subtree of a node as a flat array, optionally starting from a specific node ID
   * @param id Optional node ID to start the subtree from; if not provided, returns the entire tree as a flat array
   * @returns TreeItem<Node>[]
   */
  const getSubtreeAsArray = (id?: string): TreeItem<Node>[] => {
    if (!id) return flattenTree(tree.value);
    const cachedItem = treeMap.value.get(id);
    return cachedItem?.children ? flattenTree(cachedItem.children) : [];
  };

  /** Get the ancestors of a node, starting from the specified node ID and moving up to the root
   * @param fromNodeId Optional node ID to start the ancestor search from; if not provided, returns an empty array
   * @returns TreeItem<Node>[]
   */
  const getAncestors = (fromNodeId?: string): TreeItem<Node>[] => {
    if (!fromNodeId) return [];
    const result: TreeItem<Node>[] = [];
    let current = treeMap.value.get(fromNodeId);

    while (current) {
      result.push(current);
      current = current.parentId ? treeMap.value.get(current.parentId) : undefined;
    }
    return result;
  };

  /**
   * Get the closest ancestor of a node that is a category (role 1 or 2)
   * @param nodeId Optional node ID to start the search from; if not provided, returns null
   * @returns TreeItem<Node> | null
   */
  const getClosestCategoryAncestor = (nodeId?: string | null): TreeItem<Node> | null => {
    if (!nodeId) return null;
    let current = treeMap.value.get(nodeId);
    while (current?.parentId) {
      const parent = treeMap.value.get(current.parentId);
      if (parent && (parent.data?.role === 1 || parent.data?.role === 2)) {
        return parent;
      }
      current = parent;
    }
    return null;
  };

  /**
   * Getters for the next and previous documents in the tree, based on the current node ID
   */
  const nextDocument = (id?: string) => (id ? globalBuilder!.getSibling(id, 1, n => n?.role === 3)?.data : undefined);
  const prevDocument = (id?: string) => (id ? globalBuilder!.getSibling(id, -1, n => n?.role === 3)?.data : undefined);

  return {
    tree,
    getTreeUpToRole,
    getWorkspaceTree,
    getSubtreeAsArray,
    getAncestors,
    getClosestCategoryAncestor,
    builder: globalBuilder!,

    // Navigation & Collapse state
    nextDocument,
    prevDocument,

    isExpanded: collapseStore.isExpanded,
    setExpanded: collapseStore.setExpanded,
    toggleExpand: collapseStore.toggle,
    expandAll: () => collapseStore.setAll(true),
    collapseAll: () => collapseStore.setAll(false),
    isAllCollapsed: collapseStore.isAllCollapsed,
  };
}
