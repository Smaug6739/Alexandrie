<template>
  <div class="modal-content">
    <h2 class="title">Manage permissions <tag red>Alpha</tag></h2>

    <!-- Search + add -->
    <form @submit.prevent="addPermission">
      <label for="user">Search user</label>
      <input id="user" v-model="query" placeholder="Username or email" />

      <div v-if="user" class="user-card">
        <div class="user-info-row">
          <span class="user-meta">
            <img :src="useAvatar(user)" alt="avatar" class="avatar" />
            <span>{{ user.username }}</span>
          </span>
          <span class="joined"> Joined on {{ new Date(user.created_timestamp).toLocaleDateString() }} </span>
        </div>

        <div class="user-actions">
          <AppSelect v-model="selectedPermission" :items="NODE_PERMISSIONS" :searchable="false" size="200px" />
          <button type="submit">Add</button>
        </div>
      </div>
    </form>

    <!-- Current permissions -->
    <h3>Current permissions</h3>
    <ul class="permissions-list">
      <li v-for="perm in localNode?.permissions" :key="perm.id" class="permission-item">
        <div class="user-info-row">
          <span class="user-meta">
            <img :src="useAvatar(userById(perm.user_id))" alt="avatar" class="avatar" />
            <span>{{ userById(perm.user_id)?.username }}</span>
          </span>

          <div class="user-actions">
            <AppSelect v-model="perm.permission" :items="NODE_PERMISSIONS" :searchable="false" size="200px" @update:model-value="updatePermission(perm)" />
            <button @click="removePermission(perm)">Remove</button>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import type { Node, Permission, PublicUser } from '~/stores';

const props = defineProps<{
  nodeId: string;
}>();

const usersStore = useUserStore();
const nodesStore = useNodesStore();

const query = ref('');
const user = ref<PublicUser | null>(null);
const selectedPermission = ref(1);
const localNode = ref<Node | null>(null);

onMounted(async () => {
  localNode.value = await nodesStore.fetch({ id: props.nodeId });
  for (const perm of localNode.value.permissions) {
    perm.user = await usersStore.fetchPublicUser(perm.user_id);
  }
  console.log(localNode.value);
});

const userById = computed(() => (id: string) => usersStore.getById(id) || undefined);

watch(query, async newQuery => {
  if (newQuery) {
    user.value = await usersStore.fetchPublicUser(newQuery);
  } else {
    user.value = null;
  }
});

const addPermission = async () => {
  if (!user.value) return;
  await nodesStore.addPermission({
    node_id: props.nodeId,
    user_id: user.value.id,
    permission: selectedPermission.value,
  });
  user.value = null;
  query.value = '';
  selectedPermission.value = 1;
};

const updatePermission = async (perm: Permission) => {
  await nodesStore.updatePermission(perm);
};

const removePermission = async (perm: Permission) => {
  if (!localNode.value) return;
  await nodesStore.removePermission(localNode.value.id, perm.user_id);
  localNode.value.permissions = localNode.value.permissions.filter(p => p.id !== perm.id);
};
</script>

<style scoped>
.modal-content {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.title {
  font-size: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
}

form {
  padding-bottom: 15px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

input {
  padding: 6px 10px;
  border-radius: 6px;
  border: 1px solid var(--border-color, #ccc);
}

.user-card {
  background-color: var(--bg-ui);
  border-radius: 8px;
  padding: 10px;
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
}

.avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
}

.joined {
  color: var(--font-color-light);
  font-size: 12px;
}

.user-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

select {
  padding: 4px 8px;
  border-radius: 6px;
  border: 1px solid var(--border-color, #ccc);
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
