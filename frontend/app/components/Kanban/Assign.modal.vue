<template>
  <div class="modal-content">
    <h2 class="title"><Icon name="manage_access" display="lg" /> {{ t('components.kanban.manageAssignees') }}</h2>

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
            <AppButton type="primary" small @click="assign(user.id)">{{ t('common.actions.assign') }}</AppButton>
          </div>
        </div>
      </div>
      <Loader v-if="isLoading" />
      <p v-else-if="searchError" class="info-secondary">{{ searchError }}</p>
    </form>

    <!-- Current permissions -->
    <label for="permissions">{{ t('nodes.modals.permissions.managePermissions') }}</label>
    <p v-if="!userIds.length" class="info-secondary">{{ t('nodes.modals.permissions.noPermissions') }}</p>
    <ul id="permissions" class="permissions-list">
      <li v-for="userId in userIds" :key="userId" class="permission-item">
        <div class="user-info-row">
          <span class="user-meta">
            <UserAvatar :user="usersStore.getById(userId)" display="lg" />
            <span>{{ usersStore.getById(userId)?.username }}</span>
          </span>
          <div class="user-actions">
            <AppButton type="danger" small @click="unassign(userId)">{{ t('common.actions.unassign') }}</AppButton>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import type { PublicUser } from '~/stores';
import type { KanbanMetadata } from './Board.vue';

const props = defineProps<{ boardId: string; nodeId: string; assign: (userId: string) => void; unassign: (userId: string) => void }>();
const { t } = useI18nT();

const usersStore = useUserStore();
const nodesStore = useNodesStore();

const query = ref('');
const users = ref<PublicUser[]>([]);
const searchError = ref<string | null>(null);
const isLoading = ref(false);

const userIds = computed(() => {
  const kanbanBoard = nodesStore.getById(props.boardId);
  const kanbanMetadata = (kanbanBoard?.metadata as KanbanMetadata)?.kanban;
  return kanbanMetadata?.users?.[props.nodeId] || [];
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

.permissions-list {
  margin: 0;
  padding: 0;
  list-style: none;
}

.permission-item {
  padding: 8px;
  border-bottom: 1px solid var(--border);
}
</style>
