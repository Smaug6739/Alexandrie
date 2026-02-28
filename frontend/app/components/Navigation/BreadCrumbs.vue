<template>
  <ol class="breadcrumbs">
    <li v-for="(segment, index) in breadcrumbs" :key="index" class="breadcrumbs__item">
      <NuxtLink class="breadcrumbs__link" :to="segment.path"> {{ segment.name }} </NuxtLink>
    </li>
  </ol>
</template>

<script setup lang="ts">
interface I18nBreadcrumb {
  c?: number; // Optional count for pluralization
  i18n: I18nKey;
}

const route = useRoute();
const { t } = useI18nT();

const breadcrumbs = ref<{ name: string; path: string }[]>([])

watchEffect(() => {
  breadcrumbs.value = [];

  route.matched.forEach(match => {
    const meta = match.meta?.breadcrumb;

    if (!meta) return;

    let name = '';

    if (typeof meta === 'function') {
      breadcrumbs.value = [...breadcrumbs.value, ...meta(route)];
      return;
    } else if (typeof meta === 'object' && (meta as I18nBreadcrumb)?.i18n) {
      const { c, i18n } = meta as I18nBreadcrumb;
      name = t(i18n, { count: c });
    } else {
      name = meta as string;
    }

    if (!name) return;

    breadcrumbs.value.push({
      name,
      path: match.path,
    });
  });
});
</script>

<style scoped lang="scss">
.breadcrumbs {
  display: flex;
  margin: 0;
  padding: 0;
  align-items: center;
  list-style: none;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  white-space: nowrap;
  scroll-behavior: smooth;

  &::-webkit-scrollbar {
    display: none;
  }

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
