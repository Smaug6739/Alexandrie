<template>
  <div class="component">
    <h2>User Details</h2>
    <div v-if="user">
      <div class="user-details">
        <div class="user-detail">
          <label for="username">Username</label>
          <input id="username" v-model="user.username" type="text" />
        </div>
        <div class="user-detail">
          <label for="firstname">Firstname</label>
          <input id="firstname" v-model="user.firstname" type="text" />
        </div>
        <div class="user-detail">
          <label for="lastname">Lastname</label>
          <input id="lastname" v-model="user.lastname" type="text" />
        </div>
        <div class="user-detail">
          <label for="email">Email</label>
          <input id="email" v-model="user.email" type="email" />
        </div>
        <div class="user-detail">
          <label for="role">Role</label>
          <select id="role" v-model="user.role">
            <option :value="1">User</option>
            <option :value="2">Admin</option>
          </select>
        </div>
        <div style="display: flex; width: 100%">
          <div class="user-detail">
            <label>Created At</label>
            <div class="value">{{ new Date(user.created_timestamp).toLocaleDateString() }}</div>
          </div>
          <div class="user-detail">
            <label>Updated At</label>
            <div class="value">{{ new Date(user.updated_timestamp || 0).toLocaleDateString() }}</div>
          </div>
        </div>
      </div>

      <AButton @click="saveChanges" type="success">Save Changes</AButton>
    </div>
    <div v-else>No user found.</div>
  </div>
</template>

<script setup lang="ts">
import type { User } from '@/stores';
import AButton from '~/components/AButton.vue';

const route = useRoute();
const user = ref<User | undefined>(undefined);

watchEffect(async () => {
  user.value = await useUserStore().fetchById(route.params.id as string);
});

const saveChanges = async () => {
  if (!user.value) return;
  useUserStore()
    .update(user.value)
    .then(() => {
      useNotifications().add({ type: 'success', title: 'Success', message: 'User updated successfully', timeout: 5000 });
    })
    .catch(e => {
      useNotifications().add({ type: 'error', title: 'Error', message: e, timeout: 5000 });
    });
};

definePageMeta({ breadcrumb: 'User Details' });
</script>

<style scoped lang="scss">
.component {
  gap: 1.5rem;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  width: 100%;
}

.user-details {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1rem;
  width: 100%;
}

.user-detail {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.5rem;
  width: 100%;
}

label {
  font-weight: bold;
}
button {
  margin-top: 1rem;
}
</style>
