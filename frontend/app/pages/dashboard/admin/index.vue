<template>
  <div class="card-component">
    <h1>Admin dashboard</h1>
    <AppButton type="primary" @click="useRouter().push('/dashboard/admin/users')">Manage users</AppButton>
  </div>
</template>
