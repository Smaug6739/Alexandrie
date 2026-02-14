<template>
  <div>
    <h2 class="page-title">Editor preferences</h2>
    <p class="page-subtitle">Manage your editor preferences.</p>

    <AppPreferenceInputSection :options="options" />
  </div>
</template>

<script setup lang="ts">
import { EDITOR_FONTS } from '~/helpers/constants';

type InterfaceOption = Option & {
  tag?: string;
};

const options: Array<{ label: string; options: InterfaceOption[] }> = [
  {
    label: 'Editor',
    options: [
      {
        label: 'Editor font family',
        type: 'select',
        key: 'editorFontFamily',
        choices: EDITOR_FONTS,
      },
      {
        label: 'Editor font size',
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
      { label: 'Enable document auto-save', type: 'toggle', key: 'documentAutoSave' },
      {
        label: 'Enable Spell Check',
        description: 'Enable spell check of browser in the editor. Changes may require a page reload to take effect.',
        type: 'toggle',
        key: 'editorSpellCheck',
      },
      {
        label: 'Display statistics bar',
        description: 'Show a small statistics bar at the top of the editor with word count, characters, and lines.',
        type: 'toggle',
        key: 'editorDisplayStats',
      },
      {
        label: 'Enable Snippets',
        description: 'Enable or disable editor snippets functionality.',
        type: 'toggle',
        key: 'editorSnippetsEnabled',
      },
      {
        label: 'Simplified view for mobile',
        tag: 'New',
        description: 'Enable a simplified editor view on mobile devices for better usability.',
        type: 'toggle',
        key: 'editorSimplifiedViewOnMobile',
      },
    ],
  },
];
</script>
