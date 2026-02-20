<template>
  <div>
    <h2 class="page-title">{{ t('settings.appearance.title') }}</h2>
    <p class="page-subtitle">{{ t('settings.appearance.subtitle') }}</p>

    <AppPreferenceInputSection :options="options" />
  </div>
</template>

<script setup lang="ts">
const appColors = useAppColors();
const { t } = useI18nT();

const colorMode = useColorMode();
const { setLocale } = useI18n();

const options = computed(
  () =>
    [
      {
        label: t('settings.appearance.general'),
        options: [
          {
            label: t('settings.appearance.enableDarkMode'),
            type: 'toggle' as const,
            key: 'darkMode' as const,
            onChange: (option: boolean) => {
              colorMode.preference = option ? 'dark' : 'light';
              document.body.style.colorScheme = colorMode.preference;
            },
          },
          {
            label: t('settings.appearance.setLanguage'),
            description: t('settings.appearance.setLanguageDesc'),
            type: 'select' as const,
            key: 'locale' as const,
            choices: [
              { label: 'English', id: 'en' },
              { label: 'Français', id: 'fr' },
            ],
            onChange: (option: unknown) => {
              const localeCode = option as 'en' | 'fr';
              setLocale(localeCode);
            },
          },
          {
            label: t('settings.appearance.chooseAccentColor'),
            type: 'color' as const,
            key: 'primaryColor' as const,
            onChange: (option: number) => {
              appColors.setAppColor(option);
            },
          },
          {
            label: t('settings.appearance.interfaceStyle'),
            description: t('settings.appearance.interfaceStyleDesc'),
            type: 'radio' as const,
            key: 'style' as const,
            tag: t('settings.nav.new'),
            choices: [
              { label: t('settings.appearance.styleDefault'), id: 'default' },
              { label: t('settings.appearance.styleGlassmorphism'), id: 'glassmorphism' },
            ],
          },
        ],
      },
      {
        label: t('settings.appearance.sidebar'),
        options: [
          {
            label: t('settings.appearance.enableCompactMode'),
            description: t('settings.appearance.enableCompactModeDesc'),
            type: 'toggle' as const,
            key: 'compactMode' as const,
          },
          {
            label: t('settings.appearance.viewDock'),
            description: t('settings.appearance.viewDockDesc'),
            type: 'toggle' as const,
            key: 'view_dock' as const,
          },
          {
            label: t('settings.appearance.normalizeFileIcons'),
            description: t('settings.appearance.normalizeFileIconsDesc'),
            type: 'toggle' as const,
            key: 'normalizeFileIcons' as const,
          },
          {
            label: t('settings.appearance.displayUncategorizedResources'),
            description: t('settings.appearance.displayUncategorizedResourcesDesc'),
            type: 'toggle' as const,
            key: 'displayUncategorizedResources' as const,
          },
          { label: t('settings.appearance.hideResources'), type: 'toggle' as const, key: 'hideSidebarResources' as const },
          {
            label: t('settings.appearance.showItemsInSidebar'),
            type: 'groupCheckbox' as const,
            key: 'sidebarItems' as const,
            items: {
              manageCategories: t('settings.appearance.sidebarItems.manageCategories'),
              importation: t('settings.appearance.sidebarItems.importation'),
              cdn: t('settings.appearance.sidebarItems.cdn'),
              documents: t('settings.appearance.sidebarItems.documents'),
              settings: t('settings.appearance.sidebarItems.settings'),
              home: t('settings.appearance.sidebarItems.home'),
              newPage: t('settings.appearance.sidebarItems.newPage'),
            },
          },
        ],
      },
      {
        label: t('settings.appearance.navbar'),
        options: [
          {
            label: t('settings.appearance.navbarItemsToDisplay'),
            type: 'groupCheckbox' as const,
            key: 'navbarItems' as const,
            items: {
              breadcrumb: t('settings.appearance.navbarItems.breadcrumb'),
              search: t('settings.appearance.navbarItems.search'),
              theme: t('settings.appearance.navbarItems.theme'),
              navigation: t('settings.appearance.navbarItems.navigation'),
            },
          },
        ],
      },
    ] as { label: string; options: Option[] }[],
);
</script>
