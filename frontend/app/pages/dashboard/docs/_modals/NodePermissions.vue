<!-- This components is a modal for advanced editing document metadata -->
<template>
  <div class="modal-content">
    <h2>Manage permissions <tag yellow>Beta</tag></h2>
    <form @submit.prevent>
      <label for="user">Search user</label>
      <input id="user" v-model="query" placeholder="Username or email" />
      <div v-if="user" style="background-color: var(--bg-ui); border-radius: 8px">
        <div class="user-info-row">
          <span style="display: flex; align-items: center; gap: 10px">
            <img v-if="user.avatar" :src="useAvatar(user)" alt="avatar" style="width: 30px; height: 30px; border-radius: 50%; margin: 0" />
            <span>{{ user.username }}</span>
          </span>
          <span style="color: var(--font-color-light); font-size: 14px"> Joined on {{ new Date(user.created_timestamp).toLocaleDateString() }} </span>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import type { PublicUser } from '~/stores';

const usersStore = useUserStore();
const query = ref('');
const user = ref(null as null | PublicUser);

watch(query, async newQuery => {
  if (newQuery) {
    user.value = await usersStore.fetchPublicUser(newQuery);
  } else {
    user.value = null;
  }
});
</script>

<style scoped>
.modal-content {
  display: flex;
  flex-direction: column;
}

form {
  padding: 0 5px 25px;
  flex: 1;
  overflow-y: auto;
}

label {
  display: flex;
  align-items: center;
}

textarea {
  height: 50px;
  min-height: 50px;
  max-height: 50px;
  font-size: 14px;
  resize: none;
}

.user-info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  padding: 8px;
  transition: background-color 0.2s;
  border-radius: 8px;
}

.user-info-row:hover {
  background-color: var(--bg-ui);
}
</style>
