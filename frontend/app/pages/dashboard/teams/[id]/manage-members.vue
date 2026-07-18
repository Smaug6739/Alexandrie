<template>
  <div v-if="node" class="page-card">
    <Teleport to="#navbar-title"><Icon name="users" display="lg" /> {{ t('teams.members.title') }}</Teleport>
    <Teleport to="#navbar-bottom"><NodeTeamNavbar :team-id="teamId" /></Teleport>

    <!-- Search + add -->
    <section>
      <h2>{{ t('teams.members.permissionsTitle') }}</h2>
      <form @submit.prevent>
        <small>{{ t('teams.members.permissionsDescription') }}</small>
        <input id="user" v-model="query" :placeholder="t('nodes.modals.permissions.searchPlaceholder')" autocomplete="off" />

        <div v-for="user in users" :key="user.id" class="user-card">
          <div class="user-info-row">
            <span class="user-meta">
              <UserAvatar :user="user" />
              <span>{{ user.username }}</span>
            </span>
            <div class="user-actions">
              <AppSelect v-model="permToAdd.node_id" :items="contextOptions" :searchable="false" />
              <AppSelect v-model="permToAdd.permission" :items="NODE_PERMISSIONS" :searchable="false" size="200px" />
              <AppButton type="primary" small @click="addPermission(user)">{{ t('nodes.modals.permissions.addPermission') }}</AppButton>
            </div>
          </div>
        </div>
        <Loader v-if="isLoading" />
        <p v-else-if="searchError" class="info-secondary">{{ searchError }}</p>
      </form>

      <!-- Current permissions -->
      <p v-if="!node?.permissions.length" class="info-secondary">{{ t('nodes.modals.permissions.noPermissions') }}</p>
      <DataTable v-if="rows?.length" :headers="headers" :rows="rows || []">
        <template #username="{ cell }">
          <UserAvatar :user="cell?.data as PublicUser" />
          &nbsp;&nbsp;{{ (cell?.data as PublicUser)?.username || 'Unknown' }}
        </template>
        <template #context="{ cell }">
          <Icon
            :name="nodesStore.getById((cell?.data as Permission).node_id)?.icon || 'files'"
            display="xl"
            :class="['parent-icon', getAppAccent(nodesStore.getById((cell?.data as Permission).node_id)?.color as number, true)]"
          />
          {{ nodesStore.getById((cell?.data as Permission).node_id)?.name }}
        </template>
        <template #role_action="{ cell }">
          <div class="actions-row">
            <AppSelect
              v-model="(cell?.data as Permission).permission"
              :items="NODE_PERMISSIONS"
              :searchable="false"
              size="250px"
              @update:model-value="updatePermission(cell?.data as Permission)"
            />
          </div>
        </template>
        <template #actions="{ cell }">
          <AppBtnIcon icon="group_off" @click="removePermission(cell?.data as Permission)" />
        </template>
      </DataTable>

      <h2>{{ t('nodes.modals.permissions.inviteLabel') }}</h2>
      <div class="invite-form">
        <AppSelect v-model="invitationToAdd.permission_level" :items="NODE_PERMISSIONS" :searchable="false" />
        <AppButton type="primary" small @click="createInvitation">{{ t('nodes.modals.permissions.inviteCreate') }}</AppButton>
      </div>
      <p v-if="!invitations.length" class="info-secondary">{{ t('nodes.modals.permissions.inviteEmpty') }}</p>
      <ul id="invitations" class="permissions-list">
        <li v-for="invitation in invitations" :key="invitation.id" class="permission-item invitation-item">
          <div class="user-info-row invitation-row">
            <span class="invite-meta">
              <span class="invite-code">{{ invitation.invitation_code }}</span>
              <span class="invite-details">
                {{ t('nodes.modals.permissions.invitePermission') }}: {{ resolvePermissionName(invitation.permission_level) }} ·
                {{ shortDate(invitation.created_timestamp) }}
              </span>
            </span>

            <div class="user-actions">
              <AppButton type="secondary" small @click="copyInvitationLink(invitation.invitation_code)">{{ t('common.actions.copyLink') }}</AppButton>
              <AppButton type="danger" small @click="deleteInvitation(invitation.id)">{{ t('common.actions.revoke') }}</AppButton>
            </div>
          </div>
        </li>
      </ul>
    </section>
  </div>
</template>

<script setup lang="ts">
import { NODE_PERMISSIONS } from '~/helpers/constants';
import { resolvePermissionName } from '~/helpers/node';
import type { Node, NodeInvitation, Permission, PublicUser } from '~/stores';

definePageMeta({ breadcrumb: { i18n: 'teams.members.title' } });

const usersStore = useUserStore();
const nodesStore = useNodesStore();
const permissionsStore = useNodesPermissionsStore();

const { t } = useI18nT();
const { shortDate, numericDate } = useDateFormatters();
const { getAppAccent } = useAppColors();
const notifications = useNotifications();
const route = useRoute();
const tree = useNodesTree();

const teamId = route.params.id as string;

const node = ref<Node | undefined>();
const query = ref('');
const users = ref<PublicUser[]>([]);
const permToAdd = ref<Omit<Permission, 'id' | 'created_timestamp'>>({ node_id: teamId, user_id: '', permission: 1 });
const invitationToAdd = ref<Omit<NodeInvitation, 'id' | 'created_timestamp' | 'invitation_code'>>({ node_id: teamId, permission_level: 1 });
const selectedInvitationPermission = ref(1);
const invitations = ref<NodeInvitation[]>([]);
const searchError = ref<string | null>(null);
const isLoading = ref(false);
const permissions = ref<Permission[]>([]);

const invitationLink = (code: string) => `${window.location.origin}/dashboard/join-workspace?code=${encodeURIComponent(code)}`;
const contextOptions = computed(() => tree.getWorkspaceTree(node.value?.id as string, true));
permissionsStore.fetchPermissions(teamId, true).then(perms => (permissions.value = perms));
permissionsStore.fetchInvitations(teamId).then(invites => (invitations.value = invites));

watchEffect(async () => {
  try {
    const cached = nodesStore.getById(teamId);
    if (cached && cached.partial) {
      await nodesStore.fetch({ id: teamId });
    }
    node.value = nodesStore.getById(teamId);
    for (const perm of permissions.value) {
      usersStore.fetchPublicUser(perm.user_id);
    }
  } catch {
    node.value = undefined;
  }
});

const headers = computed(() => [
  { label: t('admin.users.headers.name'), key: 'username' },
  { label: t('admin.users.headers.role'), key: 'role' },
  { label: 'Joined At', key: 'created_at' },
  { label: 'Context', key: 'context' },
  { label: 'Role', key: 'role_action', align: 'space-around' as const },
  { label: 'Actions', key: 'actions', align: 'space-around' as const },
]);

const rows = computed(() => {
  return permissions.value.map(p => {
    const u = usersStore.getById(p.user_id);
    return {
      username: {
        type: 'slot' as const,
        data: u,
      },
      role: {
        content: p.permission == 1 ? `<tag class="blue">Read</tag>` : p.permission == 2 ? `<tag class="green">Write</tag>` : `<tag class="red">Admin</tag>`,
        type: 'html' as const,
      },
      created_at: { content: numericDate(p.created_timestamp), type: 'text' as const },
      context: { type: 'slot' as const, data: p },
      role_action: { type: 'slot' as const, data: p },
      actions: { type: 'slot' as const, data: p },
    };
  });
});

watch(query, async newQuery => {
  users.value = [];
  searchError.value = null;
  if (!newQuery) return;
  isLoading.value = true;
  searchUsers(newQuery);
});

const searchUsers = debounce((query: unknown) => {
  usersStore
    .searchFetch(query as string)
    .then(fetchedUsers => {
      users.value = fetchedUsers;
      searchError.value = null;
    })
    .catch(() => {
      users.value = [];
      searchError.value = t('nodes.modals.permissions.noResults');
    })
    .finally(() => (isLoading.value = false));
}, 750);

watch(
  () => (node.value?.accessibility ?? 0) + (node.value?.access ?? 0),
  debounce(() => nodesStore.update(node.value!), 500),
  { deep: true },
);

// Actions
const addPermission = async (user: PublicUser) => {
  if (!user) return;
  const newPermission = await permissionsStore.addPermission({
    ...permToAdd.value,
    user_id: user.id,
  });
  users.value = [];
  query.value = '';
  permToAdd.value = { ...permToAdd.value, node_id: teamId, user_id: '', permission: 1 };
  permissions.value = [newPermission, ...permissions.value];
};

const updatePermission = async (perm: Permission) => {
  await permissionsStore.updatePermission(perm);
  permissions.value = permissions.value.map(p => (p.id === perm.id ? perm : p));
};

const removePermission = async (perm: Permission) => {
  if (!node.value) return;
  await permissionsStore.removePermission(perm);
  permissions.value = permissions.value.filter(p => p.id !== perm.id);
};

const createInvitation = async () => {
  if (!node.value?.id) return;
  try {
    const invitation = await permissionsStore.addInvitation(node.value.id, selectedInvitationPermission.value);
    invitations.value = [invitation, ...invitations.value];
    selectedInvitationPermission.value = 1;
    notifications.add({ type: 'success', title: 'Invitation created' });
  } finally {
    invitationToAdd.value = { ...invitationToAdd.value, node_id: teamId, permission_level: 1 };
  }
};

const deleteInvitation = async (invitationId: string) => {
  if (!node.value?.id) return;
  await permissionsStore.removeInvitation(node.value.id, invitationId);
  invitations.value = invitations.value.filter(invitation => invitation.id !== invitationId);
  notifications.add({ type: 'success', title: 'Invitation revoked' });
};

const copyInvitationLink = async (code: string) => {
  await navigator.clipboard.writeText(invitationLink(code));
  notifications.add({ type: 'success', title: 'Invitation link copied to clipboard' });
};
</script>

<style scoped lang="scss">
h2 {
  margin: 20px 5px;
  padding-bottom: 8px;
  font-size: 20px;
}

form {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin: 15px 0;
  padding: 0 4px;
}

.user-card {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 6px 10px;
  border-radius: var(--radius-md);
  background-color: var(--surface-transparent);
}

.user-info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.user-meta {
  display: flex;
  align-items: center;
  gap: 10px;

  .avatar {
    width: 30px;
    height: 30px;
    border-radius: 50%;
  }
}

.user-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.info-secondary {
  margin: 0;
  margin-top: 10px;
  font-size: 14px;
  color: var(--text-secondary);
  text-align: center;
}

.public-info {
  margin-bottom: 10px;
  padding: 0 5px;
  border-radius: var(--radius-md);

  .info-text {
    margin: 5px 0;
    font-size: 14px;
    color: var(--text-secondary);
  }

  .public-link {
    display: flex;
    align-items: flex-end;
    gap: 2px;
    color: var(--primary);
    text-decoration: underline;
    word-break: break-all;
  }
}

.access {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
}

.permissions-list {
  margin: 0;
  padding: 0;
  list-style: none;
}

.permission-item {
  padding: 8px;

  &:not(:last-child) {
    border-bottom: 1px solid var(--border);
  }
}

.invite-form {
  display: flex;
  align-items: center;
  gap: 10px;
}

.invitation-item {
  .invitation-row {
    gap: 10px;
  }

  .invite-meta {
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
  }

  .invite-code {
    font-weight: 700;
    letter-spacing: 0.12em;
  }

  .invite-details {
    font-size: 12px;
    color: var(--text-secondary);
  }
}
</style>
