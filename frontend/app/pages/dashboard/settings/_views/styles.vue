<template>
  <div>
    <h2 class="page-title">Styles injection</h2>
    <p class="page-subtitle">Inherit and customize the application and document styles.</p>

    <AppPreferenceInputSection :options="options" />
  </div>
</template>

<script setup lang="ts">
type InterfaceOption = Option & {
  tag?: string;
};

const options: Array<{ label: string; options: InterfaceOption[] }> = [
  {
    label: 'Custom styles',
    options: [
      {
        label: 'Enable custom styles injection',
        description: 'Inject your own CSS to customize the app and document themes. Changes are applied in real-time.',
        type: 'toggle',
        key: 'stylesInjectionEnabled',
      },
      {
        label: 'Application styles',
        description: 'CSS applied globally to the entire application (layout, sidebar, navbar, etc.)',
        type: 'textarea',
        key: 'stylesInjection',
        placeholder: '/* e.g. */\n:root {\n  --surface-base: #1a1a2e;\n}',
        rows: 8,
      },
      {
        label: 'Document styles',
        description: 'CSS applied to document content (markdown preview, typography, code blocks, etc.)',
        type: 'textarea',
        key: 'stylesDocumentsInjection',
        placeholder: '/* e.g. */\nh1 {\n  color: coral;\n}',
        rows: 8,
      },
    ],
  },
];
</script>
