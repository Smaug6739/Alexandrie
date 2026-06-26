<template>
  <template v-if="hasNavigation.navigation">
    <button :disabled="!canGoBack" class="nav no-tablet" aria-label="Go back" type="button" @click="goBack">
      <Icon name="left_arrow" display="lg" />
    </button>
    <button :disabled="!canGoForward" class="nav no-tablet" aria-label="Go forward" type="button" @click="goForward">
      <Icon name="right_arrow" display="lg" />
    </button>
  </template>
</template>

<script lang="ts" setup>
const preferences = usePreferencesStore();

const router = useRouter();

const hasNavigation = preferences.get('navbarItems');

const canGoBack = ref(false);
const canGoForward = ref(false);

const goBack = () => router.go(-1);
const goForward = () => router.go(1);

function handleState(state: History['state']) {
  if (!state) return;

  canGoBack.value = state.back !== null;
  canGoForward.value = state.forward !== null;
}

router.afterEach(() => handleState(window.history.state));
</script>

<style lang="scss" scoped>
.nav {
  display: inline-flex;
  min-width: 27px;
  min-height: 27px;
  padding: 0;
  border-radius: 50%;
  transition:
    background-color $transition-medium ease,
    opacity $transition-medium ease;
  align-items: center;
  cursor: pointer;
  justify-content: center;
  overflow: hidden;

  &:hover:not(:disabled) {
    background-color: var(--selection-color);
    opacity: 0.8;
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
}
</style>
