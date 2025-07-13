<template>
  <footer>
    <div class="infos">
      <NuxtLink :to="`/dashboard/docs/edit/${document.id}`"
        ><svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24">
          <path
            d="M180-120q-24 0-42-18t-18-42v-600q0-24 18-42t42-18h405l-60 60H180v600h600v-348l60-60v408q0 24-18 42t-42 18H180Zm300-360ZM360-360v-170l382-382q9-9 20-13t22-4q11 0 22.317 4.5T827-911l83 84q8.609 8.958 13.304 19.782Q928-796.394 928-785.197q0 11.197-4.5 22.697T910-742L530-360H360Zm508-425-84-84 84 84ZM420-420h85l253-253-43-42-43-42-252 251v86Zm295-295-43-42 43 42 43 42-43-42Z"
          />
        </svg>
        Edit this page</NuxtLink
      >
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

@media screen and (min-width: 768px) {
  .items {
    display: flex;
    justify-content: space-between;
  }
}

.item {
  display: block;
  width: 100%;
  max-width: 400px;
  border-radius: 7px;
  border: 1px solid var(--border-color);
  padding: 10px;
  margin: 5px 0;
  font-weight: 500;
  font-size: 15px;
  transition: color 0.25s;

  b {
    display: block;
  }

  &:hover {
    border: 1px solid $primary-color;
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
