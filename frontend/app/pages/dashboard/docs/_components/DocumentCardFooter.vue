<template>
  <footer v-if="document">
    <div class="infos">
      <NuxtLink :to="`/dashboard/docs/edit/${document.id}`" :prefetch="false"><Icon name="edit_page" /> Edit this page</NuxtLink>
      <p>Last update: {{ new Date(document.updated_timestamp).toLocaleDateString() }}</p>
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
  font-weight: 500;
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
  font-weight: 500;
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
