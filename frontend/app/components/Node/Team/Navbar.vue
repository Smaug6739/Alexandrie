<template>
  <div>
    <span class="item">
      <NuxtLink :to="`/dashboard/teams/${team.id}`">
        <Icon name="organization" />
        Overview
      </NuxtLink>
    </span>
    <span class="item">
      <NuxtLink :to="`/dashboard/teams/${team.id}/nodes`">
        <Icon name="nodes" />
        Nodes
      </NuxtLink>
    </span>
    <span class="item">
      <NuxtLink :to="`/dashboard/teams/${team.id}/manage-members`">
        <Icon name="users" />
        Manage Members
      </NuxtLink>
    </span>
    <span class="item">
      <NuxtLink :to="`/dashboard/teams`">
        <Icon name="cdn" />
        Uploads
      </NuxtLink>
    </span>
    <span class="item">
      <NuxtLink :to="`/dashboard/teams`">
        <Icon name="insights" />
        Insights
      </NuxtLink>
    </span>
    <span class="item">
      <NuxtLink :to="`/dashboard/teams`">
        <Icon name="settings" />
        Settings
      </NuxtLink>
    </span>
  </div>
</template>

<script lang="ts" setup>
import type { Node } from '~/stores';

defineProps<{
  team: Node;
}>();
</script>

<style lang="scss" scoped>
div {
  display: flex;
  gap: 0.5rem;
}
a {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border-radius: var(--radius-sm);
  padding: 0.35rem 0.5rem;
  transition: background-color $transition-fast ease-in-out;
  font-size: 14px;

  &:hover {
    background-color: var(--surface-raised);
  }
}
.item:has(a.router-link-exact-active) {
  font-weight: 500;

  border-bottom: 2px solid var(--primary);
  a {
    background-color: var(--surface-raised);
  }
}
</style>
