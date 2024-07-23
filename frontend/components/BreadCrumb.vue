<template>
  <nav aria-label="breadcrumb">
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

<style scoped>
.breadcrumb {
  display: flex;
  flex-wrap: wrap;
  list-style: none;
  padding: 3px;
}

.breadcrumb-item + .breadcrumb-item::before {
  content: '/';
  padding: 0 0.5rem;
}

.breadcrumb-item a {
  font-size: 17px;
  font-weight: 500;
}
</style>
