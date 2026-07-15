<template>
  <div class="dock">
    <NuxtLink v-for="item in items" :key="item.label" :to="item.to" :class="{ admin: item.adminOnly, show: isAdmin && item.adminOnly }">
      <Icon :name="item.icon" display="lg" /><span v-if="mark.hasMark(item.mark as MarkId)" class="bubble" />
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
import SettingsModal from '~/pages/dashboard/settings/index.vue';

const userStore = useUserStore();
const preferences = usePreferencesStore();

const modals = useModal();
const mark = useMark();

const items = [
  { label: 'Dashboard', icon: 'dashboard', to: '/dashboard/home' },
  { label: 'Categories', icon: 'categories', to: '/dashboard/categories' },
  { label: 'Documents', icon: 'files', to: '/dashboard/docs' },
  { label: 'CDN', icon: 'cdn', to: '/dashboard/cdn' },
  { label: 'Import', icon: 'import', to: '/dashboard/import', mark: 'new-imports' },
  { label: 'Diagrams', icon: 'format/diagrams', to: '/dashboard/cdn/diagram' },
  { label: 'Admin', icon: 'users', to: '/dashboard/admin', adminOnly: true },
];

const isAdmin = computed(() => userStore.user?.role === 2);

const openSettings = () => {
  modals.add(new Modal(shallowRef(SettingsModal), { props: { isModal: true }, size: 'medium', noPadding: true }));
};
function closeDock() {
  preferences.set('view_dock', false);
}
</script>

<style scoped lang="scss">
.dock {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 1rem 0.3rem;
  border-right: 1px solid var(--border);
  background-color: var(--surface-base);
}

a {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
  border-radius: var(--radius-md);
  transition: background-color $transition-medium ease;

  &:hover {
    svg {
      color: var(--text-inverse) !important;
    }
  }
}

.admin {
  display: none;
}

.show {
  display: flex;
}

a.router-link-active {
  svg {
    color: var(--primary) !important;
  }
}
</style>
