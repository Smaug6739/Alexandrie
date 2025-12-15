<template>
  <footer v-if="document">
    <div class="infos">
      <NuxtLink :to="`/dashboard/docs/edit/${document.id}`" :prefetch="false" class="edit-link">
        <Icon name="edit_page" />
        <span>Edit this page</span>
      </NuxtLink>
      <div class="footer-meta">
        <span class="meta-item">
          <Icon name="update" />
          Last updated {{ formatRelativeDate(document.updated_timestamp) }}
        </span>
      </div>
    </div>
    <div class="items">
      <NuxtLink v-if="previous" :to="`/dashboard/docs/${previous.id}`" class="item left">
        <b class="min">Previous page</b>
        {{ previous.name }}
      </NuxtLink>
      <NuxtLink v-if="next" :to="`/dashboard/docs/${next.id}`" class="item right">
        <b class="min">Next page</b>
        {{ next.name }}
      </NuxtLink>
    </div>
  </footer>
</template>

<script lang="ts" setup>
import type { Node } from '~/stores';
defineProps<{ document?: Node; next?: Node; previous?: Node }>();
</script>

<style scoped lang="scss">
footer {
  margin: 50px 0 40px;
}
.edit-link {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border-radius: 8px;
  background: var(--bg-ui);
  color: var(--font-color);
  font-size: 13px;
  font-weight: 450;
  transition: all 0.2s ease;

  :deep(svg) {
    width: 16px;
    height: 16px;
    fill: var(--font-color-light);
  }

  &:hover {
    background: var(--primary-bg);
    color: var(--primary);

    :deep(svg) {
      fill: var(--primary);
    }
  }
}
.footer-meta {
  display: flex;
  align-items: center;
  gap: 16px;
}

b {
  font-weight: 600;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: var(--font-color-light);

  :deep(svg) {
    width: 14px;
    height: 14px;
    fill: var(--font-color-light);
  }
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
  border: 1px solid var(--border-color);
  border-radius: 7px;
  font-size: 15px;
  font-weight: 450;
  transition: color 0.25s;
  flex: 1;

  b {
    display: block;
  }

  &:hover {
    border: 1px solid var(--primary);
    color: var(--primary);
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

.min {
  font-size: small;
}

svg {
  fill: var(--font-color);
}

.infos {
  display: flex;
  font-weight: 450;
  padding: 10px 0;
  align-items: center;
  border-bottom: 1px solid var(--border-color);
  justify-content: space-between;

  a {
    display: flex;

    svg {
      margin-right: 5px;
    }
  }
}
</style>
