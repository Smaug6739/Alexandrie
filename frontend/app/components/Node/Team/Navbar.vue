<template>
  <nav class="subnav" aria-label="Team navigation">
    <span class="subnav__item">
      <NuxtLink :to="`/dashboard/teams/${teamId}`">
        <Icon name="organization" />
        <span>Overview</span>
      </NuxtLink>
    </span>
    <span class="subnav__item">
      <NuxtLink :to="`/dashboard/teams/${teamId}/nodes`">
        <Icon name="nodes" />
        <span>Nodes</span>
      </NuxtLink>
    </span>
    <span v-if="isAdmin" class="subnav__item">
      <NuxtLink :to="`/dashboard/teams/${teamId}/manage-members`">
        <Icon name="users" />
        <span>Members</span>
      </NuxtLink>
    </span>
    <span class="subnav__item">
      <NuxtLink :to="`/dashboard/teams/${teamId}/uploads`">
        <Icon name="cdn" />
        <span>Uploads</span>
      </NuxtLink>
    </span>
    <span class="subnav__item">
      <NuxtLink :to="`/dashboard/teams/${teamId}/insights`">
        <Icon name="insights" />
        <span>Insights</span>
      </NuxtLink>
    </span>
    <span v-if="isEditor" class="subnav__item">
      <NuxtLink :to="`/dashboard/teams/${teamId}/settings`">
        <Icon name="settings" />
        <span>Settings</span>
      </NuxtLink>
    </span>
  </nav>
</template>

<script lang="ts" setup>
const props = defineProps<{
  teamId: string;
}>();

const store = useNodesStore();
const nodesPermissionsStore = useNodesPermissionsStore();
const team = computed(() => store.getById(props.teamId));

const isAdmin = computed(() => {
  if (!team.value) return false;
  return nodesPermissionsStore.hasPermissions(team.value, 3);
});

const isEditor = computed(() => {
  if (!team.value) return false;
  return nodesPermissionsStore.hasPermissions(team.value, 2);
});
</script>

<style lang="scss" scoped>
/* ── Container ──────────────────────────────────────────────────── */
.subnav {
  display: flex;
  align-items: stretch;
  gap: 2px;
  // Tabs sit on the border-bottom of the header
  margin-bottom: -1px;
  padding: 0 2px;
}

/* ── Individual tab ─────────────────────────────────────────────── */
.subnav__item {
  display: inline-flex;

  a {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    height: 44px;
    padding: 0 12px;
    border-bottom: 2px solid transparent;
    border-radius: var(--radius-sm) var(--radius-sm) 0 0;
    font-size: 13.5px;
    font-weight: 500;
    color: var(--text-secondary);
    white-space: nowrap;
    transition:
      background-color $transition-fast ease-in-out,
      color $transition-fast ease-in-out,
      border-color $transition-fast ease-in-out;

    &:hover {
      color: var(--text-primary);
      background-color: var(--surface-raised);
    }
  }

  // Active tab
  &:has(a.router-link-exact-active) a {
    border-bottom-color: var(--primary);
    font-weight: 600;
    color: var(--primary);
    background-color: var(--surface-raised);
  }
}

/* ── Mobile vertical layout (driven by Navbar wrapper's :deep) ──── */
@media (width <= 767px) {
  .subnav {
    flex-direction: column;
    gap: 2px;
    margin-bottom: 0;
    padding: 6px 8px 10px;

    // Reset the bottom-border tab style; use left accent instead
    .subnav__item a {
      width: 100%;
      height: auto;
      padding: 10px 14px;
      border-bottom: none;
      border-radius: var(--radius-sm);
      font-size: 15px;
    }

    .subnav__item:has(a.router-link-exact-active) a {
      padding-left: 11px; // compensate for border
      border-bottom: none;
      border-left: 3px solid var(--primary);
    }
  }
}
</style>
