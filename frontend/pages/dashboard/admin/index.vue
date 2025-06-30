<template>
  <div class="card-component">
    <h1>Admin dashboard</h1>
    <AppButton @click="useRouter().push('/dashboard/admin/users')" type="primary">Manage users</AppButton>
  </div>
</template>
