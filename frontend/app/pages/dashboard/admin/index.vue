<template>
  <div class="card-component">
    <h1>Admin dashboard</h1>
    <p>From this dashboard, you can manage users and site settings.</p>
    <AppButton type="primary" @click="useRouter().push('/dashboard/admin/users')">Manage users</AppButton>
  </div>
</template>
