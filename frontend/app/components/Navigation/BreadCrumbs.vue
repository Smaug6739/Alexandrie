<template>
  <ol class="breadcrumbs">
    <li v-for="(segment, index) in breadcrumbs" :key="index" class="breadcrumbs__item">
      <NuxtLink class="breadcrumbs__link" :to="segment.path"> {{ segment.name }} </NuxtLink>
    </li>
  </ol>
</template>

<script setup lang="ts">
const breadcrumbs = [
  {
    path: '/dashboard',
    name: 'Home',
  },
  {
    path: '/dashboard/docs',
    name: 'Documents',
  },
  {
    path: '/dashboard/docs/680090913317453829',
    name: 'parent document',
  },
  {
    path: '/dashboard/docs/680090970779418630',
    name: 'child document',
  },
]
</script>

<style scoped lang="scss">
.breadcrumbs {
  display: flex;
  margin: 0;
  padding: 0;
  align-items: center;
  list-style: none;

  &__item {
    display: inline-flex;
    align-items: center;

    &:not(:last-child)::after {
      margin: 0 8px;
      color: var(--text-secondary);
      content: '/';
    }
  }

  &__link {
    padding: 4px 8px;
    border-radius: var(--radius-xs);
    font-size: 14px;
    font-weight: 500;
    color: var(--text-body);
    text-decoration: none;
  }
}
</style>
