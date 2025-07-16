<template>
  <footer>
    <div class="infos">
      <NuxtLink :to="`/dashboard/docs/edit/${document.id}`"><Icon name="edit_page" /> Edit this page</NuxtLink>
      <p>Last update: {{ new Date(parseInt(document.updated_timestamp)).toLocaleDateString() }}</p>
    </div>
    <div class="items">
      <NuxtLink v-if="previous" :to="`/dashboard/docs/${previous.id}`" class="item left">
        <b class="min">Page précédente</b>
        {{ previous.name }}
      </NuxtLink>
      <NuxtLink v-if="next" :to="`/dashboard/docs/${next.id}`" class="item right">
        <b class="min">Page suivante</b>
        {{ next.name }}
      </NuxtLink>
    </div>
  </footer>
</template>

<script lang="ts" setup>
import type { Document } from '~/stores';
defineProps<{ document: Document; next?: Document; previous?: Document }>();
</script>

<style scoped lang="scss">
footer {
  margin: 50px 0 40px 0;
}
.items {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 10px;
}

.item {
  display: block;
  width: 100%;
  max-width: 400px;
  min-width: 280px;
  border-radius: 7px;
  border: 1px solid var(--border-color);
  padding: 10px;
  margin: 5px 0;
  font-weight: 500;
  font-size: 15px;
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
  margin-left: auto;
  text-align: right;
}

.left {
  margin-right: auto;
  text-align: left;
}

.min {
  font-size: small;
}

.infos {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 500;
  border-bottom: 1px solid var(--border-color);

  a {
    display: flex;

    svg {
      margin-right: 5px;
    }
  }
}

svg {
  fill: var(--font-color);
}
</style>
