<template>
  <div class="dashboard-root">
    <ClientOnly>
      <BackToTop />
    </ClientOnly>
    <Sidebar />
    <MediumView>
      <Navbar />
      <NuxtPage />
    </MediumView>
  </div>
</template>
<script setup lang="ts">
const nodesStore = useNodesStore();
const userStore = useUserStore();
const preferences = usePreferencesStore();

const { setAppColor } = useAppColors();
const { locale: i18nLocale, loadLocaleMessages } = useI18n();
const { isLoading } = useAppState();
useStyleInjection(); // Custom styles for the app and documents
const { initGlobalListeners, destroyGlobalListeners } = useCommandCenter();

const primaryColor = preferences.get('primaryColor');
const interfaceStyle = preferences.get('style');
const locale = preferences.get('locale');

/* Watchers to make sure app state reflects preferences */
watch(
  primaryColor,
  color => {
    setAppColor(Number(color));
  },
  { immediate: true },
);

watch(
  interfaceStyle,
  style => {
    if (import.meta.client) {
      const THEMES = ['glassmorphism', 'minimal', 'github', 'fluent', 'modern'];
      THEMES.forEach(t => document.documentElement.classList.remove(t));
      if (style !== 'default') {
        document.documentElement.classList.add(style);
      }
      console.log('[ThemeSwitcher] Applied theme class:', style, 'to documentElement:', document.documentElement.className);
    }
  },
  { immediate: true },
);

watch(
  locale,
  async newLocale => {
    await loadLocaleMessages(newLocale);
    if (newLocale) i18nLocale.value = newLocale;
  },
  { immediate: true },
);

nodesStore.init();
userStore.fetch();
preferences.fetchFromBackend();

onMounted(() => {
  initGlobalListeners();
  isLoading.value = false;
});
onBeforeUnmount(() => {
  destroyGlobalListeners();
});
</script>

<style lang="scss">
.dashboard-root {
  display: flex;
  flex-direction: column;
  height: 100%;
}
</style>
