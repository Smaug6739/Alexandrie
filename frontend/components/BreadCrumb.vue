<template>
  <nav class="breadcrumb">
    <svg @click="next" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="M560-240 320-480l240-240 56 56-184 184 184 184-56 56Z" /></svg>
    <svg @click="previous" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z" /></svg>
    <ol class="breadcrumb">
      <li v-for="(segment, index) in breadcrumbs" :key="index" class="breadcrumb-item">
        <NuxtLink :to="segment.path"> {{ segment.name }} </NuxtLink>
      </li>
    </ol>
  </nav>
</template>

<script setup lang="ts">
const route = useRoute();
const router = useRouter();
const breadcrumbs: Ref<Array<{ name: string; path: string }>> = ref([]);
const next = () => useRouter().go(-1);
const previous = () => useRouter().go(1);

declare module 'vue-router' {
  interface RouteMeta {
    breadcrumb: () => string;
  }
}

watchEffect(() => {
  breadcrumbs.value = [];
  route.matched.forEach(match => {
    let name = '';
    if (typeof match.meta.breadcrumb == 'function') name = match.meta.breadcrumb();
    else if (typeof match.meta.breadcrumb == 'string') name = match.meta.breadcrumb;
    if (!name) return;
    const r = router.resolve(match);
    breadcrumbs.value.push({
      name,
      path: r.path,
    });
  });
});
</script>

<style scoped lang="scss">
.breadcrumb {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  list-style: none;
  padding: 3px;
}
// Svg bubble button nav
.breadcrumb svg {
  width: 27px;
  height: 27px;
  margin-right: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 50%;
  fill: var(--font-color);
  &:hover {
    background-color: var(--border-color);
  }
}

.breadcrumb-item + .breadcrumb-item::before {
  content: '>';
  padding: 0 0.5rem;
}

.breadcrumb-item a {
  font-size: 14px;
  font-weight: 500;
}
</style>
