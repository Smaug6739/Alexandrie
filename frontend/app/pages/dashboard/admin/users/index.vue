<template>
  <div class="card-component">
    <header>
      <h1>Users manager</h1>
    </header>
    <DataTable v-if="rows?.length" :headers="headers" :rows="rows || []">
      <template #action="{ cell }">
        <NuxtLink :to="`/dashboard/admin/users/${cell?.data.id}`"><Icon name="view" /></NuxtLink>
      </template>
    </DataTable>
    <div v-else>No user found.</div>
  </div>
</template>
<script setup lang="ts">
import { useAdminStore } from '~/stores/admin.store';

const adminStore = useAdminStore();
adminStore.fetchAll();

const headers = [
  { label: 'Name', key: 'username' },
  { label: 'Firstname', key: 'firstname' },
  { label: 'Lastname', key: 'lastname' },
  { label: 'Email', key: 'email' },
  { label: 'Role', key: 'role' },
  { label: 'Created at', key: 'created_at' },
  { label: 'Action', key: 'action' },
];

const rows = computed(() =>
  adminStore.users?.map(u => {
    return {
      username: { content: `<img style="border-radius:50%;width:25px;height:25px;" src="${useAvatar(u)}"/>&nbsp;&nbsp;&nbsp;${u.username}`, type: 'html' as const },
      firstname: { content: u.firstname, type: 'text' as const },
      lastname: { content: u.lastname, type: 'text' as const },
      email: { content: u.email, type: 'text' as const },
      role: { content: u.role == 2 ? `<tag class="red">Admin</tag>` : `<tag class="blue">User</tag>`, type: 'html' as const },
      created_at: { content: new Date(u.created_timestamp).toLocaleDateString(), type: 'text' as const },
      action: { type: 'slot' as const, data: { id: u.id } },
    };
  }),
);
</script>
