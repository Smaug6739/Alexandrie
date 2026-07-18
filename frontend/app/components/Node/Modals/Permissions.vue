<template>
  <div v-if="node" class="modal-content">
    <h2 class="title"><Icon name="manage_access" display="lg" /> {{ t('nodes.modals.permissions.title') }}</h2>

    <label for="accessibility">{{ t('nodes.modals.permissions.generalAccess') }}</label>
    <AppRadio v-model="node.accessibility" :items="DOCUMENT_ACCESSIBILITIES" placeholder="Accessibility" />
    <!-- Accessibility 3: Public document -->
    <div v-if="node.accessibility === 3" class="public-info">
      <p class="info-text">{{ t('nodes.modals.permissions.publicInfo') }}</p>
      <p class="info-text">{{ t('nodes.modals.permissions.shareLink') }}</p>
      <span class="public-link">
        <a :href="link" target="_blank" rel="noopener noreferrer">
          <Icon name="new_tab" display="sm" fill="var(--text-secondary)" />
          {{ link }}
        </a>
        <AppBtnIcon icon="copy" display="md" @click="copyLink" />
      </span>
      <div class="access">
        <label for="access">{{ t('nodes.modals.permissions.defaultPermission') }}</label>
        <AppSelect v-model="node.access" :items="DOCUMENT_GENERAL_ACCESS" :searchable="false" size="150px" placeholder="Default" />
      </div>
    </div>

    <!-- Search + add -->
    <form @submit.prevent>
      <label for="user">{{ t('nodes.modals.permissions.searchUser') }}</label>
      <input id="user" v-model="query" :placeholder="t('nodes.modals.permissions.searchPlaceholder')" autocomplete="off" />

      <div v-for="user in users" :key="user.id" class="user-card">
        <div class="user-info-row">
          <span class="user-meta">
            <UserAvatar :user="user" display="lg" />
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
    <label for="permissions">{{ t('nodes.modals.permissions.managePermissions') }}</label>
    <p v-if="!node?.permissions.length" class="info-secondary">{{ t('nodes.modals.permissions.noPermissions') }}</p>
    <ul id="permissions" class="permissions-list">
      <li v-for="perm in node.permissions" :key="perm.id" class="permission-item">
        <div class="user-info-row">
          <span class="user-meta">
            <UserAvatar :user="usersStore.getById(perm.user_id)" display="lg" />
            <span>{{ usersStore.getById(perm.user_id)?.username }}</span>
          </span>

          <div class="user-actions">
            <AppSelect v-model="perm.permission" :items="NODE_PERMISSIONS" :searchable="false" size="250px" @update:model-value="updatePermission(perm)">
              <template #list-footer>
                <hr />
                <AppSelectNode
                  :level="0"
                  :node="{ id: `$rm-${perm.id}`, label: t('nodes.modals.permissions.removePermission') }"
                  @select="removePermission(perm)"
                />
              </template>
            </AppSelect>
          </div>
        </div>
      </li>
    </ul>

    <hr />

    <label for="invitations">{{ t('nodes.modals.permissions.inviteLabel') }}</label>
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
  </div>
</template>

<script setup lang="ts">
import { DOCUMENT_ACCESSIBILITIES, DOCUMENT_GENERAL_ACCESS, NODE_PERMISSIONS } from '~/helpers/constants';
import type { Node, NodeInvitation, Permission, PublicUser } from '~/stores';

const props = defineProps<{ node: Node }>();
const { t } = useI18nT();

const usersStore = useUserStore();
const nodesStore = useNodesStore();
const nodesPermissionsStore = useNodesPermissionsStore();

const { shortDate } = useDateFormatters();
const notifications = useNotifications();

const node = ref<Node | undefined>(props.node);
const query = ref('');
const users = ref<PublicUser[]>([]);
const selectedPermission = ref(1);
const selectedInvitationPermission = ref(1);
const invitations = ref<NodeInvitation[]>([]);
const searchError = ref<string | null>(null);
const isLoading = ref(false);
const isCreatingInvitation = ref(false);

const link = computed(() => `${window.location.origin}/doc/${node.value?.id}`);
const invitationLink = (code: string) => `${window.location.origin}/dashboard/join-workspace?code=${encodeURIComponent(code)}`;

watchEffect(async () => {
  try {
    const cached = nodesStore.getById(props.node.id);
    if (cached && cached.partial) {
      await nodesStore.fetch({ id: props.node.id });
    }
    node.value = nodesStore.getById(props.node.id);
    for (const perm of node.value?.permissions ?? []) {
      usersStore.fetchPublicUser(perm.user_id);
    }
  } catch {
    node.value = undefined;
  }
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

const copyLink = async () => {
  await navigator.clipboard.writeText(link.value);
  notifications.add({ type: 'success', title: 'Link copied to clipboard' });
};

const addPermission = async (user: PublicUser) => {
  if (!user) return;
  await nodesPermissionsStore.addPermission({
    node_id: props.node.id,
    user_id: user.id,
    permission: selectedPermission.value,
  });

  users.value = [];
  query.value = '';
  selectedPermission.value = 1;
};

const updatePermission = async (perm: Permission) => {
  await nodesPermissionsStore.updatePermission(perm);
};

const removePermission = async (perm: Permission) => {
  if (!node.value) return;
  await nodesPermissionsStore.removePermission(perm);
  node.value.permissions = node.value.permissions.filter(p => p.id !== perm.id);
};

const refreshInvitations = async () => {
  if (!node.value?.id) return;
  invitations.value = await nodesPermissionsStore.fetchInvitations(node.value.id);
};

watch(
  () => node.value?.id,
  () => {
    refreshInvitations().catch(() => {
      invitations.value = [];
    });
  },
  { immediate: true },
);

const createInvitation = async () => {
  if (!node.value?.id) return;
  isCreatingInvitation.value = true;
  try {
    const invitation = await nodesPermissionsStore.addInvitation(node.value.id, selectedInvitationPermission.value);
    invitations.value = [invitation, ...invitations.value];
    selectedInvitationPermission.value = 1;
    notifications.add({ type: 'success', title: 'Invitation created' });
  } finally {
    isCreatingInvitation.value = false;
  }
};

const deleteInvitation = async (invitationId: string) => {
  if (!node.value?.id) return;
  await nodesPermissionsStore.removeInvitation(node.value.id, invitationId);
  invitations.value = invitations.value.filter(invitation => invitation.id !== invitationId);
  notifications.add({ type: 'success', title: 'Invitation revoked' });
};

const copyInvitationLink = async (code: string) => {
  await navigator.clipboard.writeText(invitationLink(code));
  notifications.add({ type: 'success', title: 'Invitation link copied to clipboard' });
};
</script>

<style scoped lang="scss">
.modal-content {
  display: flex;
  flex-direction: column;
  gap: 15px;
  font-family: $font-ui;
}

h2 {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 20px;
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
}

.user-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.info-secondary {
  margin: 0;
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
    font-size: 13.5px;
    color: var(--text-secondary);
  }
}

.public-link {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 2px;
  padding: 6px 10px;
  border-radius: var(--radius-sm);
  font-size: 13px;
  color: var(--primary);
  text-decoration: underline;
  word-break: break-all;
  background-color: var(--surface-raised);

  a {
    display: flex;
    align-items: center;
    gap: 5px;
    color: var(--primary);
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
  border-bottom: 1px solid var(--border);
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
