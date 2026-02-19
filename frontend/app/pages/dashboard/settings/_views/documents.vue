<template>
  <div>
    <h2 class="page-title">{{ t('settings.documents.title') }}</h2>
    <p class="page-subtitle">{{ t('settings.documents.subtitle') }}</p>

    <AppPreferenceInputSection :options="options" />
  </div>
</template>

<script setup lang="ts">
import { DOCUMENT_SIZES, DOCUMENT_THEMES, EDITOR_FONTS } from '~/helpers/constants';

type InterfaceOption = Option & {
  tag?: string;
};

const { t } = useI18nT();

const options = computed<Array<{ label: string; options: InterfaceOption[] }>>(() => [
  {
    label: t('settings.documents.section'),
    options: [
      {
        label: t('settings.documents.enablePrintMode'),
        description: t('settings.documents.enablePrintModeDesc'),
        type: 'toggle',
        key: 'printMode',
      },
      { label: t('settings.documents.hideTOC'), type: 'toggle', key: 'hideTOC' },
      {
        label: t('settings.documents.documentSize'),
        type: 'radio',
        key: 'docSize',
        choices: DOCUMENT_SIZES,
      },
      {
        label: t('settings.documents.theme'),
        description: t('settings.documents.themeDesc'),
        type: 'select',
        key: 'theme',
        choices: DOCUMENT_THEMES,
      },
      {
        label: t('settings.documents.defaultFontSize'),
        description: t('settings.documents.defaultFontSizeDesc'),
        type: 'number',
        key: 'documentFontSize',
      },
      {
        label: t('settings.documents.defaultFontFamily'),
        description: t('settings.documents.defaultFontFamilyDesc'),
        type: 'select',
        choices: EDITOR_FONTS,
        key: 'documentFontFamily',
      },
      {
        label: t('settings.documents.defaultLineHeight'),
        description: t('settings.documents.defaultLineHeightDesc'),
        type: 'number',
        key: 'documentLineHeight',
      },
    ],
  },
]);
</script>
