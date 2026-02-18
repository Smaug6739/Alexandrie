<template>
  <div>
    <h2 class="page-title">{{ t('settings.styles.title') }}</h2>
    <p class="page-subtitle">{{ t('settings.styles.subtitle') }}</p>

    <AppPreferenceInputSection :options="options" />
  </div>
</template>

<script setup lang="ts">
type InterfaceOption = Option & {
  tag?: string;
};

const { t } = useI18nT();

const options = computed<Array<{ label: string; options: InterfaceOption[] }>>(() => [
  {
    label: t('settings.styles.customStyles'),
    options: [
      {
        label: t('settings.styles.enableInjection'),
        description: t('settings.styles.enableInjectionDesc'),
        type: 'toggle',
        key: 'stylesInjectionEnabled',
      },
      {
        label: t('settings.styles.appStyles'),
        description: t('settings.styles.appStylesDesc'),
        type: 'textarea',
        key: 'stylesInjection',
        placeholder: '/* e.g. */\n:root {\n  --surface-base: #1a1a2e;\n}',
        rows: 8,
      },
      {
        label: t('settings.styles.documentStyles'),
        description: t('settings.styles.documentStylesDesc'),
        type: 'textarea',
        key: 'stylesDocumentsInjection',
        placeholder: '/* e.g. */\nh1 {\n  color: coral;\n}',
        rows: 8,
      },
    ],
  },
]);
</script>
