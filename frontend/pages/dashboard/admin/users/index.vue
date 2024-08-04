<template>
  <div class="cdn-component">
    <h2>Users manager</h2>

    <div v-if="userStore.users.length">
      <DataTable :headers="headers" :rows="rows" />
    </div>
    <div v-else>No user found.</div>
  </div>
</template>
<script setup lang="ts">
const userStore = useUserStore();
userStore.fetchAll();
definePageMeta({ breadcrumb: 'Users' });

const headers = [
  { label: 'Name', key: 'username' },
  { label: 'Firstname', key: 'firstname' },
  { label: 'Lastname', key: 'lastname' },
  { label: 'Email', key: 'email' },
  { label: 'Role', key: 'role' },
  { label: 'Created at', key: 'created_at' },
  { label: 'Action', key: 'action' },
];
const seeIcon = ` <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" style="margin:0 5px;" fill="var(--font-color-light)"><path d="M480-320q75 0 127.5-52.5T660-500q0-75-52.5-127.5T480-680q-75 0-127.5 52.5T300-500q0 75 52.5 127.5T480-320Zm0-72q-45 0-76.5-31.5T372-500q0-45 31.5-76.5T480-608q45 0 76.5 31.5T588-500q0 45-31.5 76.5T480-392Zm0 192q-146 0-266-81.5T40-500q54-137 174-218.5T480-800q146 0 266 81.5T920-500q-54 137-174 218.5T480-200Zm0-300Zm0 220q113 0 207.5-59.5T832-500q-50-101-144.5-160.5T480-720q-113 0-207.5 59.5T128-500q50 101 144.5 160.5T480-280Z"/></svg>`;

const rows: any = computed(() =>
  userStore.users.map(res => {
    return {
      username: { content: res.username },
      firstname: { content: res.firstname },
      lastname: { content: res.lastname },
      email: { content: res.email },
      role: { content: res.role == 2 ? `<span class="tag red">Admin</span>` : `<span class="tag blue">User</span>`, type: 'html' },
      created_at: { content: new Date(res.created_timestamp).toLocaleDateString() },
      action: { content: seeIcon, type: 'link', to: `/dashboard/admin/users/${res.id}` },
    };
  }),
);
</script>

<style scoped lang="scss">
.cdn-component {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

h2 {
  margin: 0;
}
</style>
