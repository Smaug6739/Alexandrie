<template>
  <div>
    <h2 class="page-title">{{ t('settings.advanced.title') }}</h2>
    <p class="page-subtitle">{{ t('settings.advanced.subtitle') }}</p>

    <div>
      <h3>{{ t('settings.advanced.resetPreferences') }}</h3>
      <p>{{ t('settings.advanced.resetPreferencesDesc') }}</p>
      <AppButton type="danger" @click="preferences.reset">{{ t('settings.advanced.resetPreferencesBtn') }}</AppButton>
    </div>
    <div>
      <h3>{{ t('settings.advanced.resetLocalStorage') }}</h3>
      <p>{{ t('settings.advanced.resetLocalStorageDesc') }}</p>
      <AppButton type="danger" @click="deleteLocalStorage">{{ t('settings.advanced.resetLocalStorageBtn') }}</AppButton>
    </div>
  </div>
</template>

<script setup lang="ts">
const preferences = usePreferences();
const { t } = useI18nT();

const deleteLocalStorage = () => {
  localStorage.clear();
  location.reload();
};
</script>

<style scoped lang="scss">
h3 {
  margin: 3rem 0 0.5rem;
  font-weight: 500;
}
</style>
