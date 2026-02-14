<template>
  <div>
    <h2 class="page-title">Documents preferences</h2>
    <p class="page-subtitle">Manage your document settings and editor preferences.</p>

    <AppPreferenceInputSection :options="options" />
  </div>
</template>

<script setup lang="ts">
import { DOCUMENT_SIZES, DOCUMENT_THEMES } from '~/helpers/constants';

type InterfaceOption = Option & {
  tag?: string;
};

const options: Array<{ label: string; options: InterfaceOption[] }> = [
  {
    label: 'Documents',
    options: [
      {
        label: 'Enable Print Mode',
        description: 'Simplify the header of printed documents (remove the thumbnail, tags, description and keep only the title)',
        type: 'toggle',
        key: 'printMode',
      },
      { label: 'Hide Table of Content', type: 'toggle', key: 'hideTOC' },
      { label: 'Enable Document auto-save', type: 'toggle', key: 'documentAutoSave' },
      {
        label: 'Document size',
        type: 'radio',
        key: 'docSize',
        choices: DOCUMENT_SIZES,
      },
      {
        label: 'Theme',
        description: 'Default theme used for documents. You can override it for each document individually.',
        type: 'select',
        key: 'theme',
        choices: DOCUMENT_THEMES,
      },
    ],
  },
];
</script>
