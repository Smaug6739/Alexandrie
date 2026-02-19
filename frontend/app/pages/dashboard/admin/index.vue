<template>
  <div class="page-card">
    <h1>{{ t('admin.dashboard.title') }}</h1>
    <p>{{ t('admin.dashboard.description') }}</p>
    <AppButton type="primary" @click="router.push('/dashboard/admin/users')">{{ t('admin.dashboard.manageUsers') }}</AppButton>
  </div>
</template>

<script setup lang="ts">
const router = useRouter();
const { t } = useI18nT();
</script>
