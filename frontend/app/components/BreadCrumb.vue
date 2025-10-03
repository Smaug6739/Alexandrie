<template>
  <nav class="breadcrumb">
    <svg
      v-if="preferences.get('navbarItems').value.navigation"
      :class="{ disabled: !canGoBack }"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 -960 960 960"
      @click="goBack"
    >
      <path d="M560-240 320-480l240-240 56 56-184 184 184 184-56 56Z" />
    </svg>

    <svg
      v-if="preferences.get('navbarItems').value.navigation"
      :class="{ disabled: !canGoForward }"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 -960 960 960"
      @click="goForward"
    >
      <path d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z" />
    </svg>

    <ol class="breadcrumb-list">
      <li v-for="(segment, index) in breadcrumbs" :key="index" class="breadcrumb-item">
        <NuxtLink :to="segment.path"> {{ segment.name }} </NuxtLink>
      </li>
    </ol>
  </nav>
</template>

<script setup lang="ts">
const route = useRoute();
const router = useRouter();
const preferences = usePreferences();

const breadcrumbs = ref<Array<{ name: string; path: string }>>([]);

const canGoBack = ref(false);
const canGoForward = ref(false);

// Renamed for clarity
const goBack = () => router.go(-1);
const goForward = () => router.go(1);

declare module 'vue-router' {
  interface RouteMeta {
    breadcrumb?: string | (() => string);
  }
}

watchEffect(() => {
  canGoBack.value = window.history.state?.back !== null;
  canGoForward.value = window.history.state?.forward !== null;
  breadcrumbs.value = [];
  route.matched.forEach(match => {
    if (!match.meta?.breadcrumb) return;

    let name = '';
    if (typeof match.meta.breadcrumb === 'function') name = match.meta.breadcrumb();
    else if (typeof match.meta.breadcrumb === 'string') name = match.meta.breadcrumb;

    if (!name) return;
    const r = router.resolve(match);
    breadcrumbs.value.push({
      name,
      path: r.path,
    });
  });
});
</script>

<style lang="scss" scoped>
.breadcrumb {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 3px;
  flex-wrap: wrap;

  svg {
    width: 27px;
    height: 27px;
    border-radius: 50%;
    transition: all 0.3s ease;
    cursor: pointer;
    fill: var(--font-color);
    margin-right: 8px;

    &:hover:not(.disabled) {
      opacity: 0.8;
      background-color: var(--selection-color);
    }

    &.disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }
  }
}

.breadcrumb-list {
  display: flex;
  align-items: center;
  list-style: none;
  padding: 0;
  margin: 0;
}

.breadcrumb-item {
  display: inline-flex;
  align-items: center;

  a {
    color: var(--font-color);
    text-decoration: none;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 14px;
    font-weight: 500;

    &:hover {
    }

    &.router-link-active {
    }
  }

  &:not(:last-child)::after {
    content: '/';
    margin: 0 8px;
    color: var(--font-color-light);
  }
}
</style>
```
