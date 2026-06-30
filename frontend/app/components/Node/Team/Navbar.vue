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
  padding: 0 2px;
  align-items: stretch;
  gap: 2px;
  // Tabs sit on the border-bottom of the header
  margin-bottom: -1px;
}

/* ── Individual tab ─────────────────────────────────────────────── */
.subnav__item {
  display: inline-flex;

  a {
    display: inline-flex;
    height: 44px;
    padding: 0 12px;
    border-radius: var(--radius-sm) var(--radius-sm) 0 0;
    font-size: 13.5px;
    font-weight: 500;
    color: var(--text-secondary);
    transition:
      background-color $transition-fast ease-in-out,
      color $transition-fast ease-in-out,
      border-color $transition-fast ease-in-out;
    align-items: center;
    border-bottom: 2px solid transparent;
    gap: 7px;
    white-space: nowrap;

    &:hover {
      color: var(--text-primary);
      background-color: var(--surface-raised);
    }
  }

  // Active tab
  &:has(a.router-link-exact-active) a {
    font-weight: 600;
    color: var(--primary);
    background-color: var(--surface-raised);
    border-bottom-color: var(--primary);
  }
}

/* ── Mobile vertical layout (driven by Navbar wrapper's :deep) ──── */
@media (width <= 767px) {
  .subnav {
    padding: 6px 8px 10px;
    flex-direction: column;
    gap: 2px;
    margin-bottom: 0;

    // Reset the bottom-border tab style; use left accent instead
    .subnav__item a {
      width: 100%;
      height: auto;
      padding: 10px 14px;
      border-radius: var(--radius-sm);
      font-size: 15px;
      border-bottom: none;
    }

    .subnav__item:has(a.router-link-exact-active) a {
      border-bottom: none;
      border-left: 3px solid var(--primary);
      padding-left: 11px; // compensate for border
    }
  }
}
</style>
