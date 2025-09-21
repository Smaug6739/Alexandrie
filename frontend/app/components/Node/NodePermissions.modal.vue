<template>
  <div v-if="node" class="modal-content">
    <h2 class="title"><Icon name="manage_access" :big="true" fill="var(--font-color)" /> Manage permissions <tag red>Alpha</tag></h2>

    <label for="accessibility">General access</label>
    <AppRadio v-model="node.accessibility" :items="DOCUMENT_ACCESSIBILITIES" placeholder="Accessibility" />
    <!-- Accessibility 3: Public document -->
    <div v-if="node.accessibility === 3" class="public-info">
      <p class="info-text">This document will be publicly accessible via a unique URL.</p>
      <p class="info-text">
        Share this link to allow anyone to view the document without needing an account:
        <br />
        <a :href="link" target="_blank" rel="noopener noreferrer" class="public-link"
          ><Icon name="new_tab" :small="true" fill="var(--font-color-light)" /><span>{{ link }}</span></a
        >
      </p>
      <div class="access">
        <p for="access">Default permission for new users</p>
        <AppSelect v-model="node.access" :items="DOCUMENT_GENERAL_ACCESS" :searchable="false" size="150px" placeholder="Default" />
      </div>
    </div>
    <!-- Search + add -->
    <form @submit.prevent>
      <label for="user">Search user</label>
      <input id="user" v-model="query" placeholder="Username or email" />

      <div v-for="user in users" :key="user.id" class="user-card">
        <div class="user-info-row">
          <span class="user-meta">
            <img :src="useAvatar(user)" alt="avatar" class="avatar" />
            <span>{{ user.username }}</span>
          </span>
          <div class="user-actions">
            <AppSelect v-model="selectedPermission" :items="NODE_PERMISSIONS" :searchable="false" size="200px" />
            <button @click="addPermission(user)">Add</button>
          </div>
        </div>
      </div>
      <p v-if="searchError" class="info-secondary">{{ searchError }}</p>
    </form>

    <!-- Current permissions -->
    <label for="permissions">Manage permissions</label>
    <p v-if="!node?.permissions.length" class="info-secondary">No permissions set</p>
    <ul id="permissions" class="permissions-list">
      <li v-for="perm in node.permissions" :key="perm.id" class="permission-item">
        <div class="user-info-row">
          <span class="user-meta">
            <img :src="useAvatar(usersStore.getById(perm.user_id))" alt="avatar" class="avatar" />
            <span>{{ usersStore.getById(perm.user_id)?.username }}</span>
          </span>

          <div class="user-actions">
            <AppSelect v-model="perm.permission" :items="NODE_PERMISSIONS" :searchable="false" size="250px" @update:model-value="updatePermission(perm)">
              <template #list-footer>
                <hr style="margin: 4px 0" />
                <AppSelectNode :level="0" :node="{ id: `$rm-${perm.id}`, label: 'Remove permission' }" @select="removePermission(perm)" />
              </template>
            </AppSelect>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import type { Node, Permission, PublicUser } from '~/stores';

const props = defineProps<{ node: Node }>();

const node = ref<Node>(props.node);

const usersStore = useUserStore();
const nodesStore = useNodesStore();

const query = ref('');
const users = ref<PublicUser[]>([]);
const selectedPermission = ref(1);
const link = computed(() => `${window.location.origin}/doc/${node.value?.id}`);
const searchError = ref<string | null>(null);

for (const perm of node.value.permissions) {
  usersStore.fetchPublicUser(perm.user_id);
}

watch(query, async newQuery => {
  if (newQuery) {
    usersStore
      .searchFetch(newQuery)
      .then(fetchedUsers => (users.value = fetchedUsers))
      .catch(() => {
        users.value = [];
        searchError.value = 'No results found';
      });
  } else {
    users.value = [];
    searchError.value = null;
  }
});
watch(
  node.value,
  debounce(() => nodesStore.update(node.value), 500),
);
const addPermission = async (user: PublicUser) => {
  if (!user) return;
  await nodesStore.addPermission({
    node_id: props.node.id,
    user_id: user.id,
    permission: selectedPermission.value,
  });
  users.value = [];
  query.value = '';
  selectedPermission.value = 1;
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
.modal-content {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

h2 {
  font-size: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
}

form {
  padding: 0 4px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.user-card {
  background-color: var(--bg-ui);
  border-radius: 8px;
  padding: 6px 10px;
  display: flex;
  flex-direction: column;
  gap: 8px;
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
  color: var(--font-color-light);
  font-size: 14px;
  margin: 0;
  text-align: center;
}

.public-info {
  padding: 0 5px;
  border-radius: 7px;
  margin-bottom: 10px;

  .info-text {
    margin: 5px 0;
    font-size: 14px;
    color: var(--font-color-light);
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

button {
  padding: 4px 8px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  background: var(--primary-color, #444);
  color: white;
}

button:hover {
  background: var(--primary-hover, #666);
}

.permissions-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.permission-item {
  padding: 8px;
  border-bottom: 1px solid var(--border-color, #ddd);
}
</style>
