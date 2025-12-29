<template>
  <div class="dock">
    <NuxtLink to="/dashboard/home">
      <Icon name="dashboard" display="lg" />
    </NuxtLink>
    <NuxtLink to="/dashboard/categories">
      <Icon name="categories" display="lg" />
    </NuxtLink>
    <NuxtLink to="/dashboard/docs">
      <Icon name="files" display="lg" />
    </NuxtLink>
    <NuxtLink to="/dashboard/cdn">
      <Icon name="cdn" display="lg" />
    </NuxtLink>

    <NuxtLink to="/dashboard/import">
      <Icon name="import" display="lg" />
    </NuxtLink>
    <NuxtLink v-if="userStore.user?.role === 2" to="/dashboard/admin">
      <Icon name="users" display="lg" />
    </NuxtLink>
    <div style="margin-top: auto">
      <NuxtLink @click="openSettings">
        <Icon name="settings" display="lg" />
      </NuxtLink>
      <NuxtLink @click="closeDock">
        <Icon name="arrow_close" display="lg" />
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import SettingsModal from '~/pages/dashboard/settings/modal.vue';

const userStore = useUserStore();

const openSettings = () => {
  useModal().add(new Modal(shallowRef(SettingsModal), { props: {}, size: 'large', noPadding: true }));
};
function closeDock() {
  usePreferences().set('view_dock', false);
}
</script>

<style scoped lang="scss">
.dock {
  display: flex;
  padding: 1rem 0.3rem;
  background-color: var(--bg-color);
  border-right: 1px solid var(--border-color);
  flex-direction: column;
  gap: 10px;
}

a {
  display: flex;
  width: 40px;
  height: 40px;
  border-radius: 8px;
  transition: background-color 0.3s ease;
  align-items: center;
  justify-content: center;

  &:hover {
    svg {
      color: var(--opposite-color) !important;
    }
  }
}

a.router-link-active {
  svg {
    color: var(--primary) !important;
  }
}
</style>
