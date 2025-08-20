<template>
  <div class="dock">
    <NuxtLink to="/dashboard/home">
      <Icon name="dashboard" fill="var(--font-color)" :big="true" />
    </NuxtLink>
    <NuxtLink to="/dashboard/categories">
      <Icon name="categories" fill="var(--font-color)" :big="true" />
    </NuxtLink>
    <NuxtLink to="/dashboard/docs">
      <Icon name="files" fill="var(--font-color)" :big="true" />
    </NuxtLink>
    <NuxtLink to="/dashboard/cdn">
      <Icon name="cdn" fill="var(--font-color)" :big="true" />
    </NuxtLink>

    <NuxtLink to="/dashboard/import">
      <Icon name="import" fill="var(--font-color)" :big="true" />
    </NuxtLink>
    <NuxtLink v-if="useUserStore().user?.role === 2" to="/dashboard/admin">
      <Icon name="users" fill="var(--font-color)" :big="true" />
    </NuxtLink>
    <div style="margin-top: auto">
      <NuxtLink to="/dashboard/settings">
        <Icon name="settings" fill="var(--font-color)" :big="true" />
      </NuxtLink>
      <NuxtLink @click="closeDock">
        <Icon name="arrow_close" fill="var(--font-color)" :big="true" />
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
function closeDock() {
  usePreferences().set('view_dock', false);
}
</script>

<style scoped lang="scss">
.dock {
  display: flex;
  flex-direction: column;
  padding: 1rem 0.3rem;
  gap: 10px;
  border-right: 1px solid var(--border-color);
}
a {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 8px;
  transition: background-color 0.3s ease;
  &:hover {
    &:deep(svg) {
      fill: var(--opposite-color);
    }
  }
}

a.router-link-active {
  &:deep(svg) {
    fill: var(--primary);
  }
}
</style>
