<template>
  <nav>
    <NuxtLinkLocale to="/" class="secondary">{{ t('public.nav.home') }}</NuxtLinkLocale>
    <div>
      <NuxtLinkLocale to="/login" class="primary">{{ t('public.nav.login') }}</NuxtLinkLocale>
      <NuxtLinkLocale to="/signup" class="secondary">{{ t('public.nav.signup') }}</NuxtLinkLocale>
    </div>
  </nav>
</template>

<script setup lang="ts">
const { t } = useI18nT();
</script>

<style scoped lang="scss">
nav {
  display: flex;
  justify-content: space-between;

  a {
    margin: 0 8px;
    padding: 4px 15px;
    border-radius: var(--radius-xxl);
  }
}

div {
  display: flex;
  align-items: center;
}

.secondary {
  border: 1px solid var(--border);
  background: var(--surface-base);
  backdrop-filter: var(--backdrop-blur) var(--backdrop-saturate);

  &:hover {
    outline: 2px solid var(--border);
    outline-offset: 2px;
  }
}

.primary {
  color: var(--surface-base);
  background: var(--primary);

  &:hover {
    outline: 2px solid var(--primary);
    outline-offset: 2px;
  }
}
</style>
