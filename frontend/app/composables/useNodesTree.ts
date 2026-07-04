/**
 * Nodes Tree Composable
 * Single source of truth for the hierarchical node structure
 */
import { TreeBuilder, flattenTree, type TreeItem } from '~/helpers/TreeBuilder';
import { resolveIcon, resolveNodeLink } from '~/helpers/node';
import type { Node } from '~/stores';

let globalBuilder: TreeBuilder<Node> | null = null;
let globalTree: ComputedRef<TreeItem<Node>[]> | null = null;

function initGlobalTree() {
  const nodesStore = useNodesStore();

  if (!globalBuilder) {
    const rawCollection = toRaw(nodesStore.nodes);
    console.log('[useNodesTree] 🏗️ Building global TreeBuilder');
    globalBuilder = new TreeBuilder<Node>(rawCollection, transformNode);
  }

  if (!globalTree) {
    globalTree = computed(() => {
      console.log('[useNodesTree] 🌳 Building global tree');
      const _ = nodesStore.getAll.size; // Trigger reactivity on nodesStore.getAll

      // Optionnel mais safe : on nettoie le cache pour éviter d'accumuler les nodes supprimés
      globalBuilder!.clearCache();

      return globalBuilder!.buildTree({
        rootFilter: node => {
          if (node?.role === 0) return false;
          if (node?.role === 1 && !nodesStore.getById(node.parent_id ?? '')) return true;
          if (!nodesStore.getById(node.parent_id ?? '')) return true;
          return false;
        },
      });
    });
  }
}

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
  const collapseStore = useCollapseStore();

  initGlobalTree();

  const builder = globalBuilder!;
  const tree = globalTree!;

  const getTreeUpToRole = (maxRole: number) =>
    computed(() => {
      return builder.buildTree({
        nodeFilter: node => node.role <= maxRole,
        rootFilter: node => {
          if (node.role === 0) return true;
          if (node.role === 1 && !nodesStore.getById(node.parent_id ?? '')) return true;
          if (!nodesStore.getById(node.parent_id ?? '')) return true;
          return false;
        },
      });
    });

  // Workspace-specific tree retrieval
  const getWorkspaceTree = (workspaceId?: string, fullTree: boolean = false): TreeItem<Node>[] => {
    if (!workspaceId) return tree.value;
    if (workspaceId === 'shared') {
      return tree.value.filter(item => item.data?.shared);
    }

    const subtree = builder.buildSubtree(workspaceId);
    if (fullTree) return subtree ? [subtree] : [];
    return (subtree?.children as TreeItem<Node>[]) ?? [];
  };

  // Subtree retrieval as flat array
  const getSubtreeAsArray = (id?: string): TreeItem<Node>[] => {
    if (!id) return flattenTree(tree.value);
    const subtree = builder.buildSubtree(id);
    return subtree?.children ? flattenTree(subtree.children as TreeItem<Node>[]) : [];
  };

  // Get ancestors of a node as TreeItems[]
  const getAncestors = (fromNodeId?: string): TreeItem<Node>[] => {
    const node = builder.getTransformedItem(fromNodeId ?? '');
    if (!node) return [];

    const result = [node];
    let current = node;
    while (current.parentId) {
      const parentNode = nodesStore.nodes.get(current.parentId);
      if (!parentNode) break;
      const transformed = builder.getTransformedItem(parentNode.id)!;
      result.push(transformed);
      current = transformed;
    }
    return result;
  };

  // Get the first ancestor that is a category (role 1 or 2)
  const getClosestCategoryAncestor = (nodeId?: string | null): TreeItem<Node> | null => {
    if (!nodeId) return null;

    let current = builder.getTransformedItem(nodeId);
    while (current?.parentId) {
      const parent = builder.getTransformedItem(current.parentId);
      if (parent && (parent.data?.role === 1 || parent.data?.role === 2)) {
        return parent;
      }
      current = parent;
    }
    return null;
  };

  const nextDocument = (id?: string) => (id ? builder.getSibling(id, 'next', n => n?.role === 3)?.data : undefined);
  const prevDocument = (id?: string) => (id ? builder.getSibling(id, 'prev', n => n?.role === 3)?.data : undefined);

  // Get children of a node (descendants) as TreeItems[]
  const getChildren = (parentId?: string | null): TreeItem<Node>[] => {
    return builder.getChildren(parentId ?? null);
  };

  return {
    // Tree data
    tree,
    getTreeUpToRole,
    getWorkspaceTree,
    getSubtreeAsArray,
    getAncestors,
    getClosestCategoryAncestor,
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
