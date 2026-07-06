import type { InvitationJoinResponse, Node, NodeInvitation, Permission } from './db_structures';

export const useNodesPermissionsStore = defineStore('nodesPermissions', () => {
  const nodesStore = useNodesStore();
  const nodes = nodesStore.getAll;
  const isFetching = ref(false);

  async function fetchPermissions(nodeId: string, recursive = false): Promise<Permission[]> {
    const params = new URLSearchParams({
      recursive: recursive.toString(),
    });
    const request = await makeRequest(`nodes/${nodeId}/permissions?${params.toString()}`, 'GET', {});
    if (request.status === 'success') {
      const permissions = request.result as Permission[];
      if (!permissions || permissions.length === 0) return [];
      nodes.startBulk();
      for (const perm of permissions) {
        const node = nodes.get(perm.node_id);
        if (!node) continue;
        const existingPermIndex = node.permissions.findIndex(p => p.id === perm.id);
        if (existingPermIndex !== -1) node.permissions[existingPermIndex] = perm;
        else node.permissions.push(perm);
        nodes.set(node.id, node);
      }
      nodes.endBulk();
      return permissions;
    }
    console.error('[store/nodes] Fetching permissions failed:', request.message);
    return [];
  }

  function hasPermissions(node: Node, level: number) {
    // Case 1: User is the owner => All permissions
    // Case 2: User has a permission entry for this node
    // Case 3: A parent node has a permission entry for this node (inherited permissions)
    const userStore = useUserStore();
    if (node.user_id === userStore.user?.id) return true;
    if (node.accessibility === 3 && level <= node.access) return true;
    let permission = node.permissions.find(p => p.user_id === userStore.user?.id)?.permission || 0;
    let currentNode = node;
    while (permission < level && currentNode.parent_id) {
      const parentNode = nodes.get(currentNode.parent_id);
      if (!parentNode) break;
      if (parentNode.user_id === userStore.user?.id) return true; // owner of parent node
      const parentPerm = parentNode.permissions.find(p => p.user_id === userStore.user?.id);
      if (parentPerm && parentPerm.permission > permission) permission = parentPerm.permission;
      currentNode = parentNode;
    }
    return permission >= level;
  }

  async function addPermission(perm: Omit<Permission, 'id' | 'created_timestamp'>): Promise<Permission> {
    console.debug(`[store/nodes/permissions] Adding permission for user ${perm.user_id} on node ${perm.node_id}`);
    const node = nodes.get(perm.node_id);
    if (!node) throw 'Node not found in store, cannot add permission';
    const request = await makeRequest(`nodes/${perm.node_id}/permissions`, 'POST', perm);
    if (request.status === 'success') {
      const newPermission = request.result as Permission;
      nodes.set(
        node.id,
        {
          ...node,
          permissions: [...node.permissions, newPermission],
        },
        true,
      );
      return newPermission;
    } else throw request.message;
  }

  async function updatePermission(perm: Permission) {
    console.debug(`[store/nodes/permissions] Updating permission for user ${perm.user_id} on node ${perm.node_id}`);
    const node = nodes.get(perm.node_id);
    if (!node) throw 'Node not found in store, cannot update permission';
    const request = await makeRequest(`nodes/${perm.node_id}/permissions/${perm.id}`, 'PATCH', { permission: perm.permission });
    if (request.status === 'success') {
      const index = node.permissions.findIndex(p => p.id === perm.id);
      const newPermissions = [...node.permissions];
      if (index !== -1 && newPermissions[index]) {
        newPermissions[index] = { ...newPermissions[index], permission: perm.permission };
        nodes.set(node.id, {
          ...node,
          permissions: newPermissions,
        });
      }
    } else throw request.message;
  }

  async function removePermission(perm: Permission) {
    console.debug(`[store/nodes/permissions] Removing permission for user ${perm.user_id} on node ${perm.node_id}`);
    const node = nodes.get(perm.node_id);
    if (!node) throw 'Node not found in store, cannot remove permission';
    const request = await makeRequest(`nodes/${perm.node_id}/permissions/${perm.id}`, 'DELETE', {});
    if (request.status === 'success') {
      const newPermissions = node.permissions.filter(p => p.id !== perm.id);
      const newNode = { ...node, permissions: newPermissions };
      if (hasPermissions(newNode, 1)) nodes.set(node.id, newNode);
      else nodes.delete(node.id);
    } else throw request.message;
  }

  async function fetchInvitations(nodeId: string): Promise<NodeInvitation[]> {
    const request = await makeRequest<NodeInvitation[]>(`nodes/${nodeId}/invitations`, 'GET', {});
    if (request.status === 'success') {
      return request.result || [];
    }
    throw request.message;
  }

  async function addInvitation(nodeId: string, permission_level: number): Promise<NodeInvitation> {
    const request = await makeRequest<NodeInvitation>(`nodes/${nodeId}/invitations`, 'POST', { permission_level });
    if (request.status === 'success') return request.result as NodeInvitation;
    throw request.message;
  }

  async function removeInvitation(nodeId: string, invitationId: string) {
    const request = await makeRequest(`nodes/${nodeId}/invitations/${invitationId}`, 'DELETE', {});
    if (request.status !== 'success') throw request.message;
  }
  async function joinInvitation(codeOrLink: string): Promise<InvitationJoinResponse> {
    const request = await makeRequest<InvitationJoinResponse>('nodes/invitations/join', 'POST', { code: codeOrLink });
    if (request.status === 'success' && request.result) {
      const { node, permission } = request.result;
      const existing = nodes.get(node.id);
      nodes.set(node.id, {
        ...(existing || {}),
        ...node,
        partial: false,
        shared: true,
        permissions: [permission],
      } as Node);
      return request.result;
    }
    throw request.message;
  }

  function clear() {
    isFetching.value = false;
  }

  return {
    fetchPermissions,
    hasPermissions,
    addPermission,
    updatePermission,
    removePermission,
    fetchInvitations,
    addInvitation,
    removeInvitation,
    joinInvitation,
    clear,
  };
});
