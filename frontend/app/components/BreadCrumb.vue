<template>
  <nav class="breadcrumb">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" @click="next"><path d="M560-240 320-480l240-240 56 56-184 184 184 184-56 56Z" /></svg>
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" @click="previous"><path d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z" /></svg>
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
  padding: 3px;
  align-items: center;
  flex-wrap: wrap;
  list-style: none;
}
// Svg bubble button nav
.breadcrumb svg {
  width: 27px;
  height: 27px;
  border-radius: 50%;
  transition: all 0.3s ease;
  cursor: pointer;
  fill: var(--font-color);
  margin-right: 8px;

  &:hover {
    background-color: var(--border-color);
  }
}

.breadcrumb-item + .breadcrumb-item::before {
  padding: 0 0.5rem;
  content: '>'; /* Separator */
}

.breadcrumb-item a {
  font-size: 14px;
  font-weight: 500;
}
</style>
