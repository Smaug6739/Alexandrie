<template>
  <div>
    <h2 class="page-title">{{ t('settings.editor.title') }}</h2>
    <p class="page-subtitle">{{ t('settings.editor.subtitle') }}</p>

    <AppPreferenceInputSection :options="options" />
  </div>
</template>

<script setup lang="ts">
import { EDITOR_FONTS } from '~/helpers/constants';

type InterfaceOption = Option & {
  tag?: string;
};

const { t } = useI18nT();

const options = computed<Array<{ label: string; options: InterfaceOption[] }>>(() => [
  {
    label: t('settings.editor.section'),
    options: [
      {
        label: t('settings.editor.fontFamily'),
        type: 'select',
        key: 'editorFontFamily',
        choices: EDITOR_FONTS,
      },
      {
        label: t('settings.editor.fontSize'),
        type: 'select',
        key: 'editorFontSize',
        choices: [
          { label: '12', id: 12 },
          { label: '14', id: 14 },
          { label: '16', id: 16 },
          { label: '18', id: 18 },
          { label: '20', id: 20 },
          { label: '22', id: 22 },
          { label: '24', id: 24 },
        ],
      },
      { label: t('settings.editor.enableAutoSave'), type: 'toggle', key: 'documentAutoSave' },
      {
        label: t('settings.editor.enableSpellCheck'),
        description: t('settings.editor.enableSpellCheckDesc'),
        type: 'toggle',
        key: 'editorSpellCheck',
      },
      {
        label: t('settings.editor.displayStatsBar'),
        description: t('settings.editor.displayStatsBarDesc'),
        type: 'toggle',
        key: 'editorDisplayStats',
      },
      {
        label: t('settings.editor.enableSnippets'),
        description: t('settings.editor.enableSnippetsDesc'),
        type: 'toggle',
        key: 'editorSnippetsEnabled',
      },
      {
        label: t('settings.editor.simplifiedMobileView'),
        tag: t('settings.nav.new'),
        description: t('settings.editor.simplifiedMobileViewDesc'),
        type: 'toggle',
        key: 'editorSimplifiedViewOnMobile',
      },
    ],
  },
]);
</script>
