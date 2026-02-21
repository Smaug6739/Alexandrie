<template>
  <nav class="navigation no-mobile" aria-label="Navigation">
    <template v-if="hasNavigation.navigation">
      <button
        :disabled="!canGoBack"
        class="navigation__item no-tablet"
        aria-label="Go back"
        type="button"
        @click="goBack"
      >
        <svg class="navigation__icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
          <path d="M560-240 320-480l240-240 56 56-184 184 184 184-56 56Z" />
        </svg>
      </button>

      <button
        :disabled="!canGoForward"
        class="navigation__item no-tablet"
        aria-label="Go forward"
        type="button"
        @click="goForward"
      >
        <svg class="navigation__icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
          <path d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z" />
        </svg>
      </button>
    </template>

    <BreadCrumbs />
  </nav>
</template>

<script setup lang="ts">
import BreadCrumbs from "~/components/Navigation/BreadCrumbs.vue";

const router = useRouter();
const preferences = usePreferencesStore();

const hasNavigation = preferences.get('navbarItems');

const canGoBack = ref(false);
const canGoForward = ref(false);

function goBack() {
  router.go(-1)
}

function goForward() {
  router.go(1)
}

function handleState(state: History['state']) {
  if (!state) return;

  canGoBack.value = state.back !== null;
  canGoForward.value = state.forward !== null;
}

router.afterEach(() => handleState(window.history.state));

watch(() => window.history.state, handleState, { immediate: true });
</script>

<style scoped lang="scss">
.navigation {
  display: flex;
  padding: 3px;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;

  &__item {
    display: inline-flex;
    padding: 0;
    border-radius: 50%;
    overflow: hidden;
    cursor: pointer;

    &:hover:not(:disabled) {
      .navigation__icon {
        background-color: var(--selection-color);
        opacity: 0.8;
      }
    }

    &:disabled {
      .navigation__icon {
        opacity: 0.4;
        cursor: not-allowed;
      }
    }
  }

  &__icon {
    width: 27px;
    height: 27px;
    fill: var(--text-body);
    transition:
      background-color $transition-medium ease,
      opacity $transition-medium ease;
  }
}
</style>
