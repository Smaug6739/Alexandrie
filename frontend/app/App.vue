<template>
  <div v-show="!isLoading" id="app">
    <ModalManager />
    <ContextMenuManager />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <Notification />
  </div>
  <SplashScreen v-show="isLoading" />
</template>

<script setup lang="ts">
import 'virtual:svg-icons-register';

useFavicon();
const preferences = usePreferencesStore();
const { setAppColor } = useAppColors();
const { setLocale } = useI18n();
const { isLoading } = useAppState();
const router = useRouter();

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
    if (import.meta.client) document.documentElement.classList.toggle('glassmorphism', style === 'glassmorphism');
  },
  { immediate: true },
);

watch(
  locale,
  newLocale => {
    if (newLocale) setLocale(newLocale);
  },
  { immediate: true },
);

router.beforeEach((to, from) => {
  if (to.path.startsWith('/dashboard') && (from.path === '/login' || from.path === '/')) {
    isLoading.value = true;
  }
  return;
});

useHead({
  link: [
    {
      rel: 'canonical',
      href: __BASE_URL__,
    },
    {
      rel: 'preconnect',
      href: __BASE_API__,
    },
    {
      rel: 'preconnect',
      href: __BASE_CDN__,
    },
  ],
  meta: [
    {
      property: 'og:url',
      content: __BASE_URL__,
    },
  ],
});
</script>

<style lang="scss">
#app {
  display: flex;
  height: 100vh;
  flex-direction: column;
  overflow: auto scroll;
}

@media print {
  #app {
    height: auto;
    overflow: visible;
  }
}
</style>
