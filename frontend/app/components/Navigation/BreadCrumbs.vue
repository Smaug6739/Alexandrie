<template>
  <ol class="breadcrumbs">
    <li v-for="(segment, index) in breadcrumbs" :key="index" class="breadcrumbs__item">
      <Icon v-if="index > 0" name="chevron_right" display="sm" class="breadcrumbs__separator" />
      <NuxtLink class="breadcrumbs__link" :class="{ 'breadcrumbs__link--active': index === breadcrumbs.length - 1 }" :to="segment.path">
        {{ segment.name }}
      </NuxtLink>
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

const breadcrumbs = ref<{ name: string; path: string }[]>([]);

watchEffect(() => {
  breadcrumbs.value = [];

  route.matched.forEach(match => {
    const meta = match.meta?.breadcrumb;
    if (!meta) return;
    let name = '';

    switch (typeof meta) {
      case 'function':
        breadcrumbs.value = [...breadcrumbs.value, ...meta(route)];
        return;
      case 'object':
        if ('i18n' in meta) {
          const { c, i18n } = meta as I18nBreadcrumb;
          name = t(i18n, { count: c });
        }
        break;
      case 'string':
        name = meta;
        break;
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
  --_fade: 12px;

  display: flex;
  min-width: 0;
  margin: 0;
  align-items: center;
  list-style: none;
  mask-image: linear-gradient(to right, transparent, black var(--_fade), black calc(100% - var(--_fade)), transparent);
  mask-image: linear-gradient(to right, transparent, black var(--_fade), black calc(100% - var(--_fade)), transparent);
  -webkit-overflow-scrolling: touch;
  overflow-x: auto;
  padding-inline: 8px;
  scroll-behavior: smooth;
  scrollbar-width: none;
  white-space: nowrap;

  &::-webkit-scrollbar {
    display: none;
  }

  &__item {
    display: inline-flex;
    align-items: center;
    gap: 2px;
  }

  &__separator {
    opacity: 0.6;
    flex-shrink: 0;
  }

  &__link {
    padding: 4px 8px;
    border-radius: var(--radius-xs);
    font-size: 0.85rem;
    font-weight: 500;
    color: var(--text-secondary);
    transition:
      background-color 0.15s ease,
      color 0.15s ease;
    text-decoration: none;

    &:hover {
      color: var(--text-body);
      background-color: var(--surface-transparent);
    }

    &--active {
      font-weight: 600;
      color: var(--text-body);
    }
  }
}
</style>
