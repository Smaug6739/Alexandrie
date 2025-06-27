<template>
  <div class="dock">
    <NuxtLink to="/dashboard">
      <Icon name="dashboard" fill="var(--font-color-dark)" :big="true" />
    </NuxtLink>
    <NuxtLink to="/dashboard/categories">
      <Icon name="categories" fill="var(--font-color-dark)" :big="true" />
    </NuxtLink>
    <NuxtLink to="/dashboard/cdn">
      <Icon name="cdn" fill="var(--font-color-dark)" :big="true" />
    </NuxtLink>
    <NuxtLink to="/dashboard/settings">
      <Icon name="settings" fill="var(--font-color-dark)" :big="true" />
    </NuxtLink>
    <NuxtLink to="/dashboard/import">
      <Icon name="import" fill="var(--font-color-dark)" :big="true" />
    </NuxtLink>
    <div style="margin-top: auto">
      <NuxtLink to="#" @click="closeDock">
        <Icon name="arrow_close" fill="var(--font-color-dark)" :big="true" />
      </NuxtLink>
    </div>
  </div>
</template>

<style scoped lang="scss">
.dock {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 0.8rem 0.3rem;
  border-right: 1px solid var(--border-color);
}
a {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  transition: background-color 0.3s ease;
  &:hover {
    background-color: var(--selection-color);
  }
}
/*
a.router-link-exact-active {
  &:deep(svg) {
    fill: var(--font-color);
  }
}
*/
</style>

<script setup lang="ts">
function closeDock() {
  usePreferencesStore().set({ key: 'hideDock', value: false });
}
</script>
