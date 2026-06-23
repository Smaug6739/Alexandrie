<template>
  <div v-if="node">
    <Teleport to="#navbar-title"><Icon name="manage_access" display="lg" /> {{ t('nodes.modals.permissions.title') }}</Teleport>
    <Teleport to="#navbar-bottom"><NodeTeamNavbar :team-id="teamId" /></Teleport>

    <!-- Search + add -->
    <section class="page">
      <form @submit.prevent>
        <small>Add a new user and change it's permissions in the table.</small>
        <input id="user" v-model="query" :placeholder="t('nodes.modals.permissions.searchPlaceholder')" autocomplete="off" />

        <div v-for="user in users" :key="user.id" class="user-card">
          <div class="user-info-row">
            <span class="user-meta">
              <img :src="avatarURL(user)" alt="avatar" class="avatar" />
              <span>{{ user.username }}</span>
            </span>
            <div class="user-actions">
              <AppSelect v-model="selectedPermission" :items="NODE_PERMISSIONS" :searchable="false" size="200px" />
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
        <template #action="{ cell }">
          <div class="actions-row">
            <AppSelect
              v-model="(cell?.data as Permission).permission"
              :items="NODE_PERMISSIONS"
              :searchable="false"
              size="250px"
              @update:model-value="updatePermission(cell?.data as Permission)"
            >
              <template #list-footer>
                <hr />
                <AppSelectNode
                  :level="0"
                  :node="{ id: `$rm-${(cell?.data as Permission).id}`, label: t('nodes.modals.permissions.removePermission') }"
                  @select="removePermission(cell?.data as Permission)"
                />
              </template>
            </AppSelect>
            <NuxtLink :to="`/dashboard/admin/users/${(cell?.data as PublicUser).id}`"><Icon name="view" /></NuxtLink>
          </div>
        </template>
      </DataTable>

      <h2>{{ t('nodes.modals.permissions.inviteLabel') }}</h2>
      <div class="invite-form">
        <AppSelect v-model="selectedInvitationPermission" :items="NODE_PERMISSIONS" :searchable="false" />
        <AppButton type="primary" small :disabled="isCreatingInvitation" @click="createInvitation">
          {{ isCreatingInvitation ? t('nodes.modals.permissions.inviteCreateProgress') : t('nodes.modals.permissions.inviteCreate') }}
        </AppButton>
      </div>
      <p v-if="!invitations.length" class="info-secondary">{{ t('nodes.modals.permissions.inviteEmpty') }}</p>
      <ul id="invitations" class="permissions-list">
        <li v-for="invitation in invitations" :key="invitation.id" class="permission-item invitation-item">
          <div class="user-info-row invitation-row">
            <span class="invite-meta">
              <span class="invite-code">{{ invitation.invitation_code }}</span>
              <span class="invite-details">
                {{ t('nodes.modals.permissions.invitePermission') }}: {{ invitation.permission_level }} · {{ shortDate(invitation.created_timestamp) }}</span
              >
            </span>

            <div class="user-actions">
              <AppButton type="secondary" small @click="copyInvitationLink(invitation.invitation_code)">Copy link</AppButton>
              <AppButton type="danger" small @click="deleteInvitation(invitation.id)">Revoke</AppButton>
            </div>
          </div>
        </li>
      </ul>
    </section>
  </div>
</template>

<script setup lang="ts">
import { NODE_PERMISSIONS } from '~/helpers/constants';
import type { Node, NodeInvitation, Permission, PublicUser } from '~/stores';

const { t } = useI18nT();

const usersStore = useUserStore();
const nodesStore = useNodesStore();

const { avatarURL } = useApi();
const { shortDate, numericDate } = useDateFormatters();
const notifications = useNotifications();
const route = useRoute();

const node = ref<Node | undefined>();
const query = ref('');
const users = ref<PublicUser[]>([]);
const selectedPermission = ref(1);
const selectedInvitationPermission = ref(1);
const invitations = ref<NodeInvitation[]>([]);
const searchError = ref<string | null>(null);
const isLoading = ref(false);
const isCreatingInvitation = ref(false);

const teamId = route.params.id as string;

const invitationLink = (code: string) => `${window.location.origin}/dashboard/join-workspace?code=${encodeURIComponent(code)}`;

watchEffect(async () => {
  const cached = nodesStore.getById(teamId);
  if (cached && cached.partial) {
    await nodesStore.fetch({ id: teamId });
  }
  node.value = nodesStore.getById(teamId);
  for (const perm of node.value?.permissions || []) {
    usersStore.fetchPublicUser(perm.user_id);
  }
});

const headers = computed(() => [
  { label: t('admin.users.headers.name'), key: 'username' },
  { label: t('admin.users.headers.role'), key: 'role', align: 'right' as const },
  { label: 'Joined At', key: 'created_at', align: 'right' as const },
  { label: t('admin.users.headers.action'), key: 'action', align: 'right' as const },
]);

const rows = computed(() =>
  node.value?.permissions.map(p => {
    const u = usersStore.getById(p.user_id);
    return {
      username: {
        content: `<img style="border-radius:50%;width:25px;height:25px;" src="${avatarURL(u)}"/>&nbsp;&nbsp;&nbsp;${u?.username || 'Unknow'}`,
        type: 'html' as const,
      },
      role: {
        content: p.permission == 1 ? `<tag class="blue">Read</tag>` : p.permission == 2 ? `<tag class="green">Write</tag>` : `<tag class="red">Admin</tag>`,
        type: 'html' as const,
      },
      created_at: { content: numericDate(p.created_timestamp), type: 'text' as const },
      action: { type: 'slot' as const, data: p },
    };
  }),
);

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
  await nodesStore.addPermission({
    node_id: node.value!.id,
    user_id: user.id,
    permission: selectedPermission.value,
  });
  users.value = [];
  query.value = '';
  selectedPermission.value = 1;
};

const createInvitation = async () => {
  if (!node.value?.id) return;
  isCreatingInvitation.value = true;
  try {
    const invitation = await nodesStore.addInvitation(node.value.id, selectedInvitationPermission.value);
    invitations.value = [invitation, ...invitations.value];
    selectedInvitationPermission.value = 1;
    notifications.add({ type: 'success', title: 'Invitation created' });
  } finally {
    isCreatingInvitation.value = false;
  }
};

const deleteInvitation = async (invitationId: string) => {
  if (!node.value?.id) return;
  await nodesStore.removeInvitation(node.value.id, invitationId);
  invitations.value = invitations.value.filter(invitation => invitation.id !== invitationId);
  notifications.add({ type: 'success', title: 'Invitation revoked' });
};

const copyInvitationLink = async (code: string) => {
  await navigator.clipboard.writeText(invitationLink(code));
  notifications.add({ type: 'success', title: 'Invitation link copied to clipboard' });
};

const updatePermission = async (perm: Permission) => {
  await nodesStore.updatePermission(perm);
};

const removePermission = async (perm: Permission) => {
  if (!node.value) return;
  await nodesStore.removePermission(node.value.id, perm.user_id);
  node.value.permissions = node.value.permissions.filter(p => p.id !== perm.id);
};
</script>

<style scoped lang="scss">
h2 {
  margin: 20px 5px;
  padding-bottom: 8px;
  font-size: 20px;
}

.page {
  width: 98%;
  margin: 0 auto;
}

form {
  display: flex;
  padding: 0 4px;
  margin: 15px 0;
  flex-direction: column;
  gap: 10px;
}

.user-card {
  display: flex;
  padding: 6px 10px;
  border-radius: var(--radius-md);
  background-color: var(--surface-transparent);
  flex-direction: column;
  gap: 8px;
}

.user-info-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
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
  padding: 0 5px;
  border-radius: var(--radius-md);
  margin-bottom: 10px;

  .info-text {
    margin: 5px 0;
    font-size: 14px;
    color: var(--text-secondary);
  }

  .public-link {
    display: flex;
    color: var(--primary);
    align-items: flex-end;
    gap: 2px;
    text-decoration: underline;
    word-break: break-all;
  }
}

.access {
  display: flex;
  align-items: center;
  justify-content: space-between;
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
    min-width: 0;
    flex-direction: column;
    gap: 2px;
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
