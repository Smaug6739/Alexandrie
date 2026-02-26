import type {NodeRole} from "~/stores";

const ROUTE_ROLE_MAPPING = {
  1: '/dashboard/categories',
  2: '/dashboard/categories',
  3: '/dashboard/docs',
  4: '/dashboard/cdn',
}

export function useBreadcrumbs() {
  const nodesStore = useNodesStore();

  function generateBreadcrumbsById(id: string, role: NodeRole) {
    const nodes = nodesStore.getByIdWithParents(id);

    return nodes.map(node => ({
      name: node.name,
      path: `${ROUTE_ROLE_MAPPING[role]}/${node.id}`
    })).reverse();
  };

  return {
    generateBreadcrumbsById,
  };
};
