<template>
  <nav class="no-mobile" aria-label="Breadcrumb">
    <svg
      v-if="preferences.get('navbarItems').value.navigation"
      :class="{ disabled: !canGoBack, 'no-tablet': true }"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 -960 960 960"
      @click="goBack"
    >
      <path d="M560-240 320-480l240-240 56 56-184 184 184 184-56 56Z" />
    </svg>

    <svg
      v-if="preferences.get('navbarItems').value.navigation"
      :class="{ disabled: !canGoForward, 'no-tablet': true }"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 -960 960 960"
      @click="goForward"
    >
      <path d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z" />
    </svg>

    <ol class="list">
      <li v-for="(segment, index) in breadcrumbs" :key="index" class="item">
        <NuxtLink :to="segment.path"> {{ segment.name }} </NuxtLink>
      </li>
    </ol>
  </nav>
</template>

<script setup lang="ts">
import type { RouteLocationNormalizedLoaded } from 'vue-router';

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
    breadcrumb?: string | ((route: RouteLocationNormalizedLoaded) => string);
  }
}

watchEffect(() => {
  canGoBack.value = window.history.state?.back !== null;
  canGoForward.value = window.history.state?.forward !== null;

  breadcrumbs.value = [];

  route.matched.forEach(match => {
    const meta = match.meta?.breadcrumb;
    if (!meta) return;

    let name = '';

    if (typeof meta === 'function') {
      name = meta(route);
    } else {
      name = meta;
    }

    if (!name) return;

    breadcrumbs.value.push({
      name,
      path: router.resolve(match).path,
    });
  });
});
</script>

<style lang="scss" scoped>
nav {
  display: flex;
  padding: 3px;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;

  svg {
    width: 27px;
    height: 27px;
    border-radius: 50%;
    transition:
      background-color $transition-medium ease,
      opacity $transition-medium ease;
    cursor: pointer;
    fill: var(--text-body);
    margin-right: 8px;

    &:hover:not(.disabled) {
      background-color: var(--selection-color);
      opacity: 0.8;
    }

    &.disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }
  }
}

.list {
  display: flex;
  margin: 0;
  padding: 0;
  align-items: center;
  list-style: none;
}

.item {
  display: inline-flex;
  align-items: center;

  a {
    padding: 4px 8px;
    border-radius: var(--radius-xs);
    font-size: 14px;
    font-weight: 500;
    color: var(--text-body);
    text-decoration: none;
  }

  &:not(:last-child)::after {
    margin: 0 8px;
    color: var(--text-secondary);
    content: '/';
  }
}
</style>
