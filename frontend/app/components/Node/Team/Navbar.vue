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
    <span class="subnav__item">
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
    <span class="subnav__item">
      <NuxtLink :to="`/dashboard/teams`">
        <Icon name="settings" />
        <span>Settings</span>
      </NuxtLink>
    </span>
  </nav>
</template>

<script lang="ts" setup>
defineProps<{
  teamId: string;
}>();
</script>

<style lang="scss" scoped>
/* ── Container ──────────────────────────────────────────────────── */
.subnav {
  display: flex;
  align-items: stretch;
  gap: 2px;
  padding: 0 2px;
  // Tabs sit on the border-bottom of the header
  margin-bottom: -1px;
}

/* ── Individual tab ─────────────────────────────────────────────── */
.subnav__item {
  display: inline-flex;

  a {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    padding: 0 12px;
    height: 44px;
    border-radius: var(--radius-sm) var(--radius-sm) 0 0;
    font-size: 13.5px;
    font-weight: 500;
    color: var(--text-secondary);
    white-space: nowrap;
    border-bottom: 2px solid transparent;
    transition:
      background-color $transition-fast ease-in-out,
      color $transition-fast ease-in-out,
      border-color $transition-fast ease-in-out;

    &:hover {
      background-color: var(--surface-raised);
      color: var(--text-primary);
    }
  }

  // Active tab
  &:has(a.router-link-exact-active) a {
    color: var(--primary);
    background-color: var(--surface-raised);
    border-bottom-color: var(--primary);
    font-weight: 600;
  }
}

/* ── Mobile vertical layout (driven by Navbar wrapper's :deep) ──── */
@media (max-width: 767px) {
  .subnav {
    flex-direction: column;
    padding: 6px 8px 10px;
    gap: 2px;
    margin-bottom: 0;

    // Reset the bottom-border tab style; use left accent instead
    .subnav__item a {
      height: auto;
      padding: 10px 14px;
      border-radius: var(--radius-sm);
      border-bottom: none;
      font-size: 15px;
      width: 100%;
    }

    .subnav__item:has(a.router-link-exact-active) a {
      border-bottom: none;
      border-left: 3px solid var(--primary);
      padding-left: 11px; // compensate for border
    }
  }
}
</style>
