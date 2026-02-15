<template>
  <footer v-if="document">
    <div class="footer-top-row">
      <NuxtLink :to="`/dashboard/docs/edit/${document.id}`" :prefetch="false" class="edit-link">
        <Icon name="edit_page" display="sm" />
        <span>Edit this page</span>
      </NuxtLink>
      <div class="last-updated">
        <Icon name="update" />
        Last updated {{ formatRelativeDate(document.updated_timestamp) }}
      </div>
    </div>
    <div class="items">
      <NuxtLink v-if="previous" :to="`/dashboard/docs/${previous.id}`" class="item left">
        <b>Previous page</b>
        {{ previous.name }}
      </NuxtLink>
      <NuxtLink v-if="next" :to="`/dashboard/docs/${next.id}`" class="item right">
        <b>Next page</b>
        {{ next.name }}
      </NuxtLink>
    </div>
  </footer>
</template>

<script lang="ts" setup>
import type { Node } from '~/stores';

defineProps<{ document?: Node; next?: Node; previous?: Node }>();

const { formatRelativeDate } = useDateFormatters();
</script>

<style scoped lang="scss">
footer {
  margin: 50px 0 40px;
}

.edit-link {
  display: flex;
  padding: 8px 14px;
  border-radius: var(--radius-md);
  font-size: 13px;
  font-weight: 500;
  background: var(--surface-transparent);
  transition:
    color $transition-base ease,
    background-color $transition-base ease;
  align-items: center;
  gap: 6px;

  &:hover {
    color: var(--primary);
    background: var(--primary-bg);
  }
}

.last-updated {
  display: flex;
  align-items: center;
  font-size: 13px;
  color: var(--text-secondary);
  gap: 6px;
}

.items {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: space-between;
}

.item {
  display: block;
  width: 100%;
  min-width: 280px;
  max-width: 400px;
  margin: 5px 0;
  padding: 10px;
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  font-size: 15px;
  font-weight: 450;
  transition: color 0.25s;
  flex: 1;

  &:hover {
    border: 1px solid var(--primary);
    color: var(--primary);
  }
  b {
    display: block;
    font-size: 10px;
    text-transform: uppercase;
    color: var(--text-secondary);
    font-weight: 600;
  }
}

.right {
  text-align: right;
  margin-left: auto;
}

.left {
  text-align: left;
  margin-right: auto;
}

.footer-top-row {
  display: flex;
  padding: 10px 0;
  font-weight: 450;
  align-items: center;
  border-bottom: 1px solid var(--border);
  justify-content: space-between;
}
</style>
